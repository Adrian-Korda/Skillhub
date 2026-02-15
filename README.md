# SkillHub

SkillHub is a comprehensive full-stack project designed to scrape job market statistics for tech roles, manipulate and present the data dynamically, and predict market trends using machine learning. The project is divided into four main components: Backend, Frontend, Data Scraping, and Machine Learning.

<img width="1407" alt="SkillHub Dashboard" src="https://github.com/user-attachments/assets/5924c176-3b64-44de-8b46-c6488fc5dfbe">

You can find the [**Live Project Here!**](https://skillhub-project.vercel.app/)
> **Note:** The backend may take up to several minutes to boot up.

## Tech Stack

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

## Features

- **Data Scraping**: Engineered a comprehensive scraping tool to aggregate job listings from WeWorkRemotely and RemoteOK using Python and pandas.
- **Backend**: Dynamic manipulation and serving of market data through a Java Spring Boot application.
- **Database**: Real-time data storage and management within a hosted PostgreSQL database.
- **Frontend**: Seamless integration with a user-friendly ReactJS interface to visualize trends.
- **Machine Learning**: Created a Random Forest model to predict future skill popularity by integrating historical data with scikit-learn.

## Running Locally

If you want to run this project on your local machine, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/SkillHub.git](https://github.com/YourUsername/SkillHub.git)
cd SkillHub
```

### 2. Database Setup
Ensure you have PostgreSQL installed and running.

1. Create a database named skillhub_db (or whatever you prefer).
2. Update the backend/src/main/resources/application.properties file with your local credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillhub_db
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
```

### 3. Backend Setup (Java)
Navigate to the backend folder and start the Spring Boot server:
```bash
cd backend
# Using Maven Wrapper (Recommended)
./mvnw spring-boot:run
```
The backend will start on http://localhost:8080.

### 4. Frontend Setup (React)
Open a new terminal, navigate to the frontend folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on http://localhost:5173

### 5. Python AI & Scraper Setup
Open a third terminal for the data science component.
```bash
cd MarketPredictor
# Install required libraries
pip install -r requirements.txt
# Run the predictor script manually to test
python market_predictor.py
```
> **Note:** Ensure you set the `DATABASE_URL` environment variable if running the script against a cloud database, or configure it to point to your local Postgres instance.

### Contributing
Contributions, issues, and feature requests are welcome!
