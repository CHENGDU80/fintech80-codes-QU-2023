import json
import semantic_kernel as sk
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

    context = kernel.create_new_context()

    Events_dict = {}

    context["Events"] = Events_list

    for i in range(len(news_list)):

        news = str(news_list[i]) #["articles"]["results"]

        print(f"News: {news}")

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
            context["Events"] += f"- {event}\n"

            if event in Events_dict:
                Events_dict[event]["News"].append(news)
                for prop in properties:
                    if prop not in Events_dict[event]["Properties"]:
                        Events_dict[event]["Properties"].append(prop)
                    else:
                        pass
            else:
                Events_dict.update({event: {"News": [news], "Properties": properties}})

            if "Summary" in Events_dict[event]:
                context["Old_Summary"] = Events_dict[event]["Summary"]
                context["New_Event_News_List"] = news
                Events_dict[event]["Summary"] = news_extend_summary_function(
                    context=context
                ).variables.input

            else:
                context["Event_News_List"] = news
                Events_dict[event]["Summary"] = news_summary_function(
                    context=context
                ).variables.input

    return Events_dict, context["Events"]

# %% 

@app.post("/process-news")
async def process_news(request: Request):
    Events_list= ''
    raw_data = await request.body()
    logger.info(f"Received data:")
    if raw_data:
        try:
            # Convert bytes to string
            data_str = raw_data.decode("utf-8")
            
            # Convert string to Python dictionary or list
            news_list = json.loads(data_str)
            logger.info(news_list)
            logger.info("yes")
            # Triggering the function
            analyzed_news_dict, Events_list = analysze_news(news_list['newsData'], Events_list)

            now = datetime.now()
            
            json_results_path = ''
            
            # Saving the results to a JSON file
            with open(f'{json_results_path}/analyzed_news_{now.strftime("%H-%M-%S_%d-%m-%Y")}.json', 'w') as f:
                json.dump(analyzed_news_dict, f)

            # Sending a success response
            return JSONResponse(content={"status": "success", "message": "Data processed successfully"}, status_code=200)
    
        except Exception as e:
            # Handling errors and sending an error response
            return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)
    return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)
