import { ref } from "vue";
//@ts-ignore
import csv from "../../public/cases.csv";
export const raw = csv;
interface Entry {
    country: "usa",
    country_division: string
    points_of_interest: string
    related_actions_tags: string
}
export interface TravelKnowledge {
    states: {
        value: string
        label: string
        points: {
            value: string
            label: string
            actions: {
                value: string
                label: string
            }[];
        }[];
    }[]
}
export function transformKb(data:Entry[] = []): TravelKnowledge {
    const knowledge: TravelKnowledge = {
        states:[]
    }
    for (const row of data) {
        let state = knowledge.states.find(state => state.value === row.country_division)
        if (state) {
            const point = state.points.find(point => point.value === row.points_of_interest)
            if (point) {
                point.actions.push({ value: row.related_actions_tags, label: row.related_actions_tags })
            } else {
                const actions = row.related_actions_tags.split(', ').map(action => ({ value: action, label: action }))
                state.points.push({
                    value: row.points_of_interest,
                    label: row.points_of_interest,
                    actions,
                })
            }
        } else {
            knowledge.states.push({
                value: row.country_division,
                label: row.country_division,
                points: [{
                    value: row.points_of_interest,
                    label: row.points_of_interest,
                    actions: row.related_actions_tags.split(', ').map(action => ({ value: action, label: action }))
                }]
            })
        }
    }
    console.log(knowledge)
    return knowledge
}
export const travelKnowledge = ref<TravelKnowledge>(transformKb(raw))

export interface LocationInput {
    country_division: string
    point_of_interest: string
    related_actions_tags: string
}

export interface InvalidState {
    state: "INVALID";
    reason: "STATE" | "POINT" | "ACTION";
}
export type Validation = {
    state: "VALID";
} | InvalidState;
export interface ValidationOutput {
    validation: Validation
    input: LocationInput
}
export function validateInput(input: LocationInput, kb:TravelKnowledge): Validation {
    const state = kb.states.find(state => state.value === input.country_division)
    if (!state) return { state: "INVALID", reason: "STATE" }
    const point = state.points.find(point => point.value === input.point_of_interest)
    if (!point) return { state: "INVALID", reason: "POINT" }
    const action = point.actions.find(action => action.value === input.related_actions_tags)
    if (!action) return { state: "INVALID", reason: "ACTION"}
    return { state: "VALID"}
}
interface USState {
    value: string // lowercase name of the state
    label: string // formal name of the state
}
export const USStates: (USState & any)[] = [
    { value: '', label: 'Select a state', attrs: { disabled: true } },
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "arizona", label: "Arizona" },
    { value: "arkansas", label: "Arkansas" },
    { value: "california", label: "California" },
    { value: "colorado", label: "Colorado" },
    { value: "connecticut", label: "Connecticut" },
    { value: "delaware", label: "Delaware" },
    { value: "florida", label: "Florida" },
    { value: "georgia", label: "Georgia" },
    { value: "hawaii", label: "Hawaii" },
    { value: "idaho", label: "Idaho" },
    { value: "illinois", label: "Illinois" },
    { value: "indiana", label: "Indiana" },
    { value: "iowa", label: "Iowa" },
    { value: "kansas", label: "Kansas" },
    { value: "kentucky", label: "Kentucky" },
    { value: "louisiana", label: "Louisiana" },
    { value: "maine", label: "Maine" },
    { value: "maryland", label: "Maryland" },
    { value: "massachusetts", label: "Massachusetts" },
    { value: "michigan", label: "Michigan" },
    { value: "minnesota", label: "Minnesota" },
    { value: "mississippi", label: "Mississippi" },
    { value: "missouri", label: "Missouri" },
    { value: "montana", label: "Montana" },
    { value: "nebraska", label: "Nebraska" },
    { value: "nevada", label: "Nevada" },
    { value: "new hampshire", label: "New Hampshire" },
    { value: "new jersey", label: "New Jersey" },
    { value: "new mexico", label: "New Mexico" },
    { value: "new york", label: "New York" },
    { value: "north carolina", label: "North Carolina" },
    { value: "north dakoata", label: "North Dakota" },
    { value: "ohio", label: "Ohio" },
    { value: "oklahoma", label: "Oklahoma" },
    { value: "oregon", label: "Oregon" },
    { value: "pennsylvania", label: "Pennsylvania" },
    { value: "rhode island", label: "Rhode Island" },
    { value: "south carolina", label: "South Carolina" },
    { value: "south dakota", label: "South Dakota" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "utah", label: "Utah" },
    { value: "vermont", label: "Vermont" },
    { value: "virginia", label: "Virginia" },
    { value: "washington", label: "Washington" },
    { value: "west virginia", label: "West Virginia" },
    { value: "wisconsin", label: "Wisconsin" },
    { value: "wyoming", label: "Wyoming" }
]

