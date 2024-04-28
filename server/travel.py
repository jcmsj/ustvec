import pandas as pd
import re

df = pd.read_csv('./cases.csv')

def setContextCountryDivision(itinerary):
  matched_country_division=[]
  patterns = [re.compile(country_division,re.IGNORECASE) for country_division in df['country_division'].unique()]
  for pattern in patterns:
    if re.search(pattern, itinerary):
      matched_country_division.append(pattern.pattern)
  return matched_country_division

def setContextPOI(itinerary):
  matched_poi=[]
  patterns = [re.compile(point_of_interest,re.IGNORECASE) for point_of_interest in df['points_of_interest'].unique()]
  for pattern in patterns:
    if re.search(pattern, itinerary):
      matched_poi.append(pattern.pattern)
  return matched_poi

def setContextActions(itinerary):
  matched_actions=[]
  patterns = [re.compile(pattern, re.IGNORECASE) for tags in df['related_actions_tags'] for pattern in tags.split(", ")]
  patterns= list(set(patterns))
  for pattern in patterns:
    if re.search(pattern, itinerary):
      matched_actions.append(pattern.pattern)
  return matched_actions

def checkRelatedActions(matched_poi_itinerary, matched_related_actions_itinerary):
  related_actions = df[df['points_of_interest'].isin(matched_poi_itinerary)]['related_actions_tags'].str.split(", ").explode().values
  anomalous_action=[]
  for action in matched_related_actions_itinerary:
    if action not in related_actions:
      anomalous_action.append(action)
  if anomalous_action:
    return {"anomalous_actions": anomalous_action, "matched_poi_itinerary": matched_poi_itinerary}
  else:
    return {}

def checkPOIinCountryDivision(matched_country_division_itinerary, matched_poi_itinerary):
  points_of_interest = df[df['country_division'].isin(matched_country_division_itinerary)]['points_of_interest'].values
  anomalous_location=[]
  for poi in matched_poi_itinerary:
    if poi not in points_of_interest:
      anomalous_location.append(poi)
  if anomalous_location:
    return {"anomalous_locations": anomalous_location, "matched_country_division_itinerary": matched_country_division_itinerary}
  else:
    return {}

def checkdate(itinerary):
  date_pattern = r'Day (\d+):|(\d+:\d+ (?:AM|PM))'
  matches = re.findall(date_pattern, itinerary)
  result = {}
  current_day = None
  for day, time in matches:
    if day:
      current_day = int(day)
      result[current_day] = []
    else:
      result[current_day].append(time)

  if check_sequential_days(result):
    result = convert_to_double(result)
    for day, times in result.items():
      start_time = times[0]
      prior_time = 0
      for time in times:
        if time < start_time:
          return {"anomalous_time": time, "day": day, "start_time": start_time}
        elif time < prior_time:
          return {"anomalous_time": time, "day": day, "prior_time": prior_time}
        prior_time = time
  else:
    return {"day_sequence_discrepancy": True}
  return {}

def convert_to_double(time_dict):
  converted_result = {}
  for key, times in time_dict.items():
    converted_result[key] = [convert_time(time) for time in times]
  return converted_result

def convert_time(time_str):
  hours, minutes = map(int, time_str[:-3].split(':'))
  if 'PM' in time_str and hours != 12:
    hours += 12
  time_decimal = hours + (minutes / 100)
  return time_decimal

def check_sequential_days(result):
  expected_key = 1
  for key in result.keys():
    if key != expected_key:
      return False
    expected_key += 1
  return True

def checkItinerary(itinerary):
  knowledge_of_location = False
  consistency_of_poi_actions = False
  result = {}

  date_check_result = checkdate(itinerary)
  if date_check_result:
    result.update(date_check_result)
  else:
    poi_country_division_result = checkPOIinCountryDivision(setContextCountryDivision(itinerary), setContextPOI(itinerary))
    if poi_country_division_result:
      result.update(poi_country_division_result)
    else:
      knowledge_of_location = True
      actions_result = checkRelatedActions(setContextPOI(itinerary), setContextActions(itinerary))
      if actions_result:
        result.update(actions_result)
        consistency_of_poi_actions = False
      else:
        consistency_of_poi_actions = True

  result["knowledge_of_location"] = knowledge_of_location
  result["consistency_of_poi_actions"] = consistency_of_poi_actions

  return result

def main():
  '''Run if main module'''
  itinerary = """
    New york, california + central park, statue of liberty, empire state building, golden gate bridge
    + explore, chill, relax, buy, shop, shopping, acquire, get, eat, dine, lunch, dinner, sight seeing fvdfbsgrbetyh swimming
  """

  result = checkItinerary(itinerary)
  print(result)

if __name__ == '__main__':
  main()
