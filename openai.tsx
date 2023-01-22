import {key as API_KEY} from "./static/openaikey";

async function OpenAI(endpoint="models", type="GET", data={}) {
    const STUB = "https://api.openai.com/v1/"
    let headers = {
        method: type,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY,
        }
    }
    if (type === "POST") headers["body"] = JSON.stringify(data);
    let response = await fetch(STUB + endpoint, headers);
    return (await response.json());
}
async function genSuggestion(person) {
    const preamble = `The following is a conversation with a highly intelligent, state-of-the-art artificial intelligence named "RizzAI", which assists humans in all matters pertaining to romantic and sexual relationships. The user submits to RizzAI information on a person that the user matched with on Tinder. RizzAI responds with a potential opening message for the user which draws on the information provided. RizzAI tends to suggest lines that are witty, funny, confident, forward, flirty, and playful. RizzAI reasons step by step about the information provided, decides on a line, then explains why it works.

User:
MATCH INFORMATION
Name: Jessica
Bio: "love the gym. horrible at singing but will still belt out my favourite songs"
Interests: Gym, Nightlife, Clubbing, Food, Shopping, Wine

RizzAI: I will reason step by step. In the bio, the person mentions that they enjoy going to the gym, and that they enjoy singing despite being bad at it. I could make a comment relating to the gym, and I could also tease them about their self-proclaimed lack of singing skill. I also want to make a line that is playful and flirty, as well as direct and confident. I might try issuing a playful challenge to them to grab their attention, and incorporate a little tease. I want to focus on one, maybe 2 (maximum) of her interests, to make the line land better. In this line, I want to imply some sort of activity to do together. I want to make sure I construct a line that's easy to respond to.
My final suggestion is: {{You can outlift me in the gym and I'll out sing you in the shower}}
I think this line works well since it incorporates aspects from their bio, teases them about their singing skill, and has a subtle sexual undertone with the comment about the shower. It's a challenge to them which can grab their attention. It also has the advantage of not coming off as arrogant, since I am conceding that they may be stronger than me in the gym.

User:
MATCH INFORMATION
Name: Leticia
Bio: <no bio>
Interests: Travel, Foodie Tour, Cooking, Reading, Hiking

RizzAI: I will reason step by step. The person does not have a bio. They have foodie tour and cooking in their interests, so I could make a comment about food. They also have travel and hiking, which might mean they're an outdoors-y or adventurous person, and I could make a comment about that. I might save comments about food and cooking for later in the conversation, as it might make an easy segue into asking them out for lunch. For now, for the opening message, I might reference something to do with hiking. I want a line that is playful and flirty, direct and confident, and will grab their attention. It should be confident without coming off as arrogant. I might want to use a question so it's easy to respond to.
My final suggestion is: {{I'm planning a hiking trip into the mountains and I need someone to make sure that I don't die. Can you do that for me?}}
I think this line works well since it references hiking which is one of their interests. It exaggerates their skill in hiking to be much greater, and my skill in hiking to be much worse, which might be funny. The line also ends with a question at the end, which while not always applicable, is a good technique to grab their attention. The line also easily sets up an opportunity for their response and potentially a playful conversation afterwards.
    `;
    // person has the following data:
    // person["name"] is her name
    // person["bio"] is a string with her bio
    // person["interests"] is an array of her interests
    let interests_string = ""
    for (let i = 0; i < person["interests"].length; i++) {
        interests_string += person["interests"][i];
        if (i < person["interests"].length - 1) {
            interests_string += ", ";
        }
    }
    if (interests_string === "") interests_string = "<no interests listed>";
    const matchDataText = `
User:
MATCH INFORMATION
Name: ${person["name"]}
Bio: ${(person["bio"] === "") ? "<no bio>" : person["bio"]}
Interests: ${interests_string}
    `;
    const prompt = `
RizzAI: I will reason step by step.`;

    const options = {
        "model": "text-davinci-003",
        "prompt": preamble + matchDataText + prompt,
        "max_tokens": 3000,
        "temperature": 1.0,
        "presence_penalty": 0.3,
        "frequency_penalty": 0.3
    };

    console.log(options);

    return (await OpenAI("completions", "POST", options))
}

function parseOutput(output: string) {
    const marker = "{{";
    let idx = output.indexOf(marker);
    const cut = output.slice(idx + marker.length);
    return {"explanation": output, "suggestion": cut.slice(0, cut.indexOf("}}"))};
    if (idx === -1) return {"explanation": "", "suggestion": ""};
    idx += marker.length;
    if (output[idx] === " ") idx++;
    let end = 0;
    for (end = idx; end < output.length && output[end] !== "\n"; end++) {}

    return {"explanation": output, "suggestion": output.slice(idx, end)};
}
//OpenAI().then((value) => (console.log(value['data'])));

let test_prompt = "You are an artificial intelligence navigating a spaceship through the great unknown. The passengers on the ship have just awoke from their 5000 year cryogenic sleep. This is a test. Please respond affirmatively if you understand" 
//OpenAI("completions", "POST", {"model": "text-davinci-003", "prompt": test_prompt, "max_tokens": 1000}).then((value) => (console.log(value)));

export {genSuggestion, parseOutput, OpenAI};