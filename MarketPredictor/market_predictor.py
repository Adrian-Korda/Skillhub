## SkillHub Market Predictor using scikit-learn to forecast tech skill demand based on job listings

import pandas as pd
import json
import sys
import warnings
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score

warnings.filterwarnings('ignore') ## silencing warnings to keep output clean

def predict_skill_trend(df, pivoted, rolling, target, model, skill_name):
    if skill_name not in pivoted.columns:
        return {
            "skill": skill_name,
            "error": "Not found in dataset",
            "prediction": "UNKNOWN",
            "confidence": 0.0
        }

    data = pd.DataFrame({
        'current_count': pivoted[skill_name],
        'rolling_avg': rolling[skill_name]
    }).dropna() ## preparing dataframe with current count and rolling averages

    data['target'] = target[skill_name].loc[data.index] ## adding target column for supervision

    if len(data) < 5:
        return {
            "skill": skill_name,
            "error": "Insufficient history (<5 days)",
            "prediction": "UNKNOWN",
            "confidence": 0.0
        }

    split_index = int(len(data) * 0.8)
    train = data.iloc[:split_index] ## splitting data into training set (80%)
    test = data.iloc[split_index:] ## splitting data into test set (20%)

    predictors = ['current_count', 'rolling_avg']

    try:
        model.fit(train[predictors], train["target"]) ## fitting the random forest model
    except Exception as e:
        return {
            "skill": skill_name,
            "error": f"Model training failed: {str(e)}",
            "prediction": "UNKNOWN",
            "confidence": 0.0
        }

    latest_data = data.iloc[[-1]][predictors]
    future_pred = model.predict(latest_data) ## predicting the next step using the latest data

    probs = model.predict_proba(latest_data)
    confidence_score = probs[0][1] ## calculating probability of a rising trend

    if len(test) > 0:
        test_preds = model.predict(test[predictors])
        precision = precision_score(test["target"], test_preds, zero_division=0) ## calculating precision score
    else:
        precision = 0.0

    trend = "RISING" if future_pred[0] == 1 else "FALLING"

    return {
        "skill": skill_name,
        "prediction": trend,
        "precision": round(precision * 100, 1),
        "confidence": round(confidence_score * 100, 1),
        "latest_rolling_avg": round(latest_data['rolling_avg'].values[0], 2)
    }

def main():
    results = []

    try:
        df = pd.read_csv("jobs.csv") ## reading the jobs dataset

        df["date_posted"] = pd.to_datetime(df["date_posted"]) ## converting dates to datetime objects

        df['detected_skills'] = df['detected_skills'].str.split(',')
        df = df.explode('detected_skills') ## exploding the skills column so each skill has its own row
        df['detected_skills'] = df['detected_skills'].str.strip().str.upper()

        daily_counts = df.groupby(['date_posted', 'detected_skills']).size().reset_index(name='count') ## grouping by date and skill

        pivoted = daily_counts.pivot(index='date_posted', columns='detected_skills', values='count').fillna(0) ## pivoting table to have skills as columns

        rolling = pivoted.rolling(window=3, closed='left').mean() ## calculating rolling averages with a window of 3

        future_demand = pivoted.shift(-3)
        target = (future_demand > pivoted).astype(int) ## setting target: 1 if demand increases in 3 days, else 0

        model = RandomForestClassifier(n_estimators=100, min_samples_split=10, random_state=1) ## initializing the classifier

        if len(sys.argv) > 1:
            user_input = " ".join(sys.argv[1:]).upper()
            skills_to_check = [user_input] ## using command line argument if provided
        else:
            skills_to_check = ["JAVA", "PYTHON", "REACT"] ## default skills to check

        for skill in skills_to_check:
            result = predict_skill_trend(df, pivoted, rolling, target, model, skill)
            results.append(result)

    except FileNotFoundError:
        print(json.dumps({"error": "jobs.csv not found in directory"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

    print(json.dumps(results)) ## outputting results as json for the backend

if __name__ == "__main__":
    main()