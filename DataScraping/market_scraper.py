## importing necessary libraries
import requests
import pandas as pd
import xml.etree.ElementTree as ET
import re
import os
from datetime import datetime

WWR_URL = "https://weworkremotely.com/categories/remote-programming-jobs.rss" ## defining the WWR rss feed url
REMOTEOK_URL = "https://remoteok.com/api" ## defining the RemoteOK api url

## getting the path for the list of target skills
JAVA_FILE_PATH = "../backend/src/main/java/com/skillhub/backend/util/SkillConstants.java"

def load_skills_from_java():
    ## default fallback in case file isn't found
    default_skills = ["Python", "Java", "React", "JavaScript", "SQL", "AWS", "Docker"]

    if not os.path.exists(JAVA_FILE_PATH): return default_skills ## checking if file exists

    try:
        with open(JAVA_FILE_PATH, 'r') as f:
            content = f.read()

        ## regex to find content inside target list
        match = re.search(r'TARGET_SKILLS\s*=\s*(?:Arrays\.asList|List\.of)\s*\((.*?)\);', content, re.DOTALL)

        if match:
            raw_content = match.group(1)
            ## cleaning up the string: removing quotes and whitespace
            skills = [s.strip().replace('"', '') for s in raw_content.split(',')]
            return [s for s in skills if s] ## returning non-empty strings

        return default_skills
    except:
        return default_skills

TARGET_SKILLS = load_skills_from_java() ## loading skills dynamically from java

def extract_skills_from_text(text):
    if not isinstance(text, str): return "" ## checking if text is valid
    found_skills = [] ## list to store found skills
    text_lower = text.lower()
    for skill in TARGET_SKILLS:
        ## checking for whole word matches to avoid finding "Go" in "Google"
        if f" {skill.lower()} " in f" {text_lower} ":
            found_skills.append(skill)
    return ", ".join(found_skills) ## joining skills into a string

def parse_date(date_str):
    if not date_str or str(date_str).strip() == "": ## handling empty dates
        return datetime.now().date()

    try:
        dt = pd.to_datetime(date_str, utc=True) ## attempting pandas standard parsing
        if pd.isna(dt): raise ValueError
        return dt.date()
    except:
        try:
            clean_str = str(date_str).split(" +")[0] ## cleaning timezone info for rss format
            return datetime.strptime(clean_str, "%a, %d %b %Y %H:%M:%S").date() ## manual parsing fallback
        except:
            return datetime.now().date() ## final fallback to current date

def fetch_weworkremotely():
    try:
        headers = {'User-Agent': 'SkillPulse-Student-Project'} ## setting user agent to avoid blocking
        response = requests.get(WWR_URL, headers=headers)
        if response.status_code != 200: return [] ## returning empty if request fails

        root = ET.fromstring(response.content) ## parsing xml content
        jobs = [] ## list to store wwr jobs
        for item in root.findall('./channel/item'):
            title = item.find('title').text
            description = item.find('description').text
            link = item.find('link').text
            pub_date = item.find('pubDate').text

            if ":" in title:
                company, job_title = title.split(":", 1) ## splitting title to get company and role
            else:
                company, job_title = "Unknown", title

            jobs.append({
                "job_title": job_title.strip(),
                "company_name": company.strip(),
                "location": "Remote",
                "description_text": description,
                "source_url": link,
                "date_posted": pub_date,
                "source": "WeWorkRemotely",
                "detected_skills": extract_skills_from_text(description + " " + title) ## extracting skills from description
            })
        return jobs
    except:
        return []

def fetch_remoteok():
    try:
        headers = {'User-Agent': 'SkillHub-Student-Project (contact: adriankorda6@gmail.com)'}
        response = requests.get(REMOTEOK_URL, headers=headers)
        if response.status_code != 200: return [] ## checking response status

        data = response.json() ## parsing json response
        jobs = [] ## list to store remoteok jobs
        for item in data[1:]: ## skipping the first item which is usually legal info
            tags = item.get('tags', [])
            description = item.get('description', '')
            raw_date = item.get('date', '')

            manual_skills = extract_skills_from_text(description) ## extracting skills manually
            all_skills = list(set(tags + manual_skills.split(", "))) ## merging tags and manual skills
            all_skills = [s for s in all_skills if s] ## filtering empty strings

            jobs.append({
                "job_title": item.get('position', 'Unknown Role'),
                "company_name": item.get('company', 'Unknown Company'),
                "location": item.get('location', 'Remote'),
                "description_text": description,
                "source_url": item.get('url', ''),
                "date_posted": raw_date,
                "source": "RemoteOK",
                "detected_skills": ", ".join(all_skills)
            })
        return jobs
    except:
        return []

def main():
    wwr = fetch_weworkremotely() ## fetching data from wwr
    remote = fetch_remoteok() ## fetching data from remoteok

    all_jobs = wwr + remote ## combining both datasets
    if not all_jobs: return

    df = pd.DataFrame(all_jobs) ## converting list to dataframe
    df['date_posted'] = df['date_posted'].apply(parse_date) ## applying date cleaning to the column

    df.to_csv("job_listings.csv", index=False) ## exporting final data to csv

if __name__ == "__main__":
    main()