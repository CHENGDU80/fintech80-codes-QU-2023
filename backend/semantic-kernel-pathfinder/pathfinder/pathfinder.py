# %%
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
import sys
import json
from semantic_kernel.planning.basic_planner import BasicPlanner


# %%
with open("data/latest-news.json", "r", encoding="utf-8") as f1:
    file1_content = f1.read()
latest_news = json.loads(file1_content)
# %%
with open("data/News_Category_Dataset_v3.json", "r") as f2:
    News_Category_Dataset_v3 = [json.loads(line) for line in f2 if line.strip()]
# %%
with open("data/100_latest_news.txt", "r", encoding="utf-8") as f3:
    file3_content = f3.read()
latest_100_news = json.loads(file3_content)

# %%
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

# %%
# Semantic Function
NewsAnalysisSkill = kernel.import_semantic_skill_from_directory(
    "../samples/skills", "NewsAnalysisSkill"
)
news_classifier_function = NewsAnalysisSkill["NewsClassifier"]
news_summary_function = NewsAnalysisSkill["EventNewsSummary"]
news_extend_summary_function = NewsAnalysisSkill["EventsNewsSummaryExtend"]
news_properties_function = NewsAnalysisSkill["EventProperties"]

context = kernel.create_new_context()
# %%

context["Events"] = ""
context["Old_Summary"] = ""
context["Event_News_List"] = ""
context["New_Event_News_List"] = ""

Events_dict = {}

# %%

for i in range(100):
    news = str(latest_100_news["articles"]["results"][i])
    # news = str(latest_news[i])

    print(f"News: {news}")

    context["News"] = news

    news_classification = news_classifier_function(context=context)
    event = news_classification.variables.input
    # Show the response
    print(f"Event: {news_classification}")
    
    news_properties = news_properties_function(context=context)
    properties = json.loads(news_properties.variables.input)
    print(f"Properties: {news_properties}")
    

    if "ErrorCodes.ServiceError" in event:
        print("Error: ", event)
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
#%%
Events_json = json.dumps(Events_dict)

# %%
with open('100_latest_news_analyzed.json', 'w') as f:
    json.dump(Events_json, f)

#%%


async def classify_news(input_text: str) -> None:
    # Save new message in the context variables
    print(f"News: {input_text}")

    context["News"] = input_text

    # Process the user message and get an answer
    news_classification = await news_classifier_function.invoke_async(context=context)

    # Show the response
    print(f"Event: {news_classification}")

    # Append the new interaction to the chat history
    context["Events"] += f"- {news_classification}\n"


# %%
