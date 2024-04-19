## Requirement:
* Create an expert system
* US Tourist Visa Eligibility Checker

## Plan
* Mostly use rule-based but some portions may use fuzzy logic.

## User Inputs:
### General
- [ ] 1. Full name
- [ ] 2. Birth date 
- [x] 3. Passport validity
- [ ] 5. Other visited countries
- [ ] 6. Previous VISA attempts
    * \# of failed
    * \# of success
### Travel itinerary
* passport should be valid for at least N days after the end of the travel plan.
* activities:
    * destination
    * start date
    * end date
### Prove strong ties to home
* Job/Career
    * Showing significant income so as to convince the immigration officer that the visa applicant would not readily leave this job for another opportunity in the US. 
    * Possible documents:
        1. Certificate of employment w/ declared salary/pay stub showing an income of at least $2000 or Php 100K.
* School enrollment
* Businesses Owned
    1. shows at least $2000 in net income
* Assets
    1. Title to real estate
    2. Bank account showing significant balance
* Family
* Volunteer Work & Organization Memberships

## Output:
1. Eligibility in % and word
2. Give advice, things to build on

## References:
* https://rapidvisa.com/resources/strong-ties/    

## For future research:
1. Data gathered may be used to create a Case-based expert system
