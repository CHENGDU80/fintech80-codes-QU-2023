import json
import os
import semantic_kernel as sk
import traceback
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from fastapi import FastAPI, Body, Request
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Optional
import logging
from fastapi.responses import JSONResponse
from pydantic import BaseModel


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(debug=True)
kernel = sk.Kernel()

# %%
# OpenAI API
# api_key, org_id = sk.openai_settings_from_dot_env()
# kernel.add_chat_service("chat-gpt", OpenAIChatCompletion("gpt-3.5-turbo", api_key, org_id))

# Azure OpenAI API
deployment, api_key, endpoint = sk.azure_openai_settings_from_dot_env()
kernel.add_chat_service(
    "chat_completion", AzureChatCompletion(deployment, endpoint, api_key)
)

# Add CORS middleware
origins = [
    "http://localhost:3000",  # Assuming your React app runs on port 3000
    # Add any other origins you might need in the future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsArticle(BaseModel):
    article_id: str
    title: str
    link: str
    keywords: List[str]
    creator: List[str]
    video_url: Optional[str]
    description: str
    content: str
    pubDate: str
    image_url: Optional[str]
    source_id: str
    source_priority: int
    country: List[str]
    category: List[str]
    language: str

def analysze_news(news_list, Events_list):

    # Import Semantic Skill
    NewsAnalysisSkill = kernel.import_semantic_skill_from_directory("./semantic-kernel-pathfinder/samples/skills", "NewsAnalysisSkill")
    
    # Define Semantic Functions
    news_classifier_function = NewsAnalysisSkill["NewsClassifier"]
    news_summary_function = NewsAnalysisSkill["EventNewsSummary"]
    news_extend_summary_function = NewsAnalysisSkill["EventsNewsSummaryExtend"]
    news_properties_function = NewsAnalysisSkill["EventProperties"]
    event_risk_opp_prediction_function = NewsAnalysisSkill["EventRiskOpportunity"]

    context = kernel.create_new_context()

    Events_dict = {}

    context["Events"] = json.dumps(Events_list)
    try:

        for i in range(len(news_list)):
            news = str(news_list[i]) #["articles"]["results"]

            context["News"] = news

            news_classification = news_classifier_function(context=context)
            event = news_classification.variables.input
            # Show the response
            logger.info(f"Event: {news_classification}")
            
            news_properties = news_properties_function(context=context)
            properties = json.loads(news_properties.variables.input)
            logger.info(f"Properties: {news_properties}")    

            if "ErrorCodes.ServiceError" in event:
                logger.info("Error: ", event)
            else:
                # Append the new interaction to the chat history
                Events_list.append(event)
                context["Events"] = json.dumps(Events_list)

                if event in Events_dict:
                    
                    Events_dict[event]["News"].append(news)

                    # Adding new properties related to an event
                    Events_dict[event]["Properties"].update(properties)

                else:
                    Events_dict.update({event: {"News": [news], "Properties": properties}})

                if "Summary" in Events_dict[event]:

                    # Updating a summary of a known event with new news
                    context["Old_Summary"] = Events_dict[event]["Summary"]
                    context["New_Event_News"] = news
                    Events_dict[event]["Summary"] = news_extend_summary_function(
                        context=context
                    ).variables.input

                else:
                    # Generating a summary of a new event
                    context["Event_News"] = news
                    Events_dict[event]["Summary"] = news_summary_function(
                        context=context
                    ).variables.input

                #Predicting Risk and Opportunity
                context["Event_Summary"] = Events_dict[event]["Summary"]
                context["Event_News_List"] = str(Events_dict[event]["News"][-1])
                context["Properties"] = str(Events_dict[event]["Properties"])

                risk_opp_properties = event_risk_opp_prediction_function(context = context)

                logger.info("Risk vs Opportunity:", risk_opp_properties.variables.input)
                Events_dict[event]["Properties"] = json.loads(risk_opp_properties.variables.input)

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        logger.error(traceback.format_exc())
        # Handling errors and sending an error response
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)

    return Events_dict, Events_list


# %% 

@app.post("/process-news")
async def process_news(request: Request):
    Events_list= []
    raw_data = await request.body()
    logger.info(f"Received data:")
    if raw_data:
        try:
            # Convert bytes to string
            data_str = raw_data.decode("utf-8")
            
            # Convert string to Python dictionary or list
            news_list = json.loads(data_str)
            # logger.info(news_list)
            # logger.info("yes")
            # Triggering the function
            analyzed_news_dict, Events_list = analysze_news(news_list['newsData'], Events_list)

            now = datetime.now()

            # Sending a success response
            return JSONResponse(content=analyzed_news_dict, status_code=200)
    
        except Exception as e:
            # Handling errors and sending an error response
            return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)
    return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)
