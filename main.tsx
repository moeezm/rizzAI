import * as ReactDOM from "react-dom";
import * as React from "react";
import Portal from "@mui/base/Portal";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { IconButton, Skeleton } from "@mui/material";
import { genSuggestion, parseOutput, OpenAI } from "./openai";


// x TODO: change parseOutput to return both explanation and the final suggestion separately
// x TODO: scrape bio and interests from network requests to actually generate relevant data (put in localStorage with id, read id from url, check if id's data is in localStorage)
// TODO: add proper skeleton element instead of loading text
// x TODO: add refresh, explain, and insert buttons
// TODO: change insert button to copy text
// TODO: make a better display for the explanation
// TODO: Style everything well
console.log("Hello");

function copyText(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom); 
    // textArea.value = text;
    // document.getElementsByTagName("form")[0].querySelectorAll("[type='submit']")[0].className= "button Lts($ls-s) Z(0) CenterAlign Mx(a) Cur(p) Tt(u) Ell Bdrs(100px) Px(24px) Px(20px)--s Py(0) Mih(40px) Pos(r) Ov(h) C(#fff) Bg($c-pink):h::b Bg($c-pink):f::b Bg($c-pink):a::b Trsdu($fast) Trsp($background) Bg($g-ds-background-brand-gradient) button--primary-shadow StyledButton Bxsh($bxsh-btn) Fw($semibold) focus-button-style Mb(16px) As(fe)";
}

function Suggestion(props) {
    const [explanation, setExplanation] = React.useState(null);
    const [person, setPerson] = React.useState(null);
    const [showingExplanation, showExplanation] = React.useState(false);
    const message = React.useRef("");

    function toggleExplanation() {
        if (showingExplanation) showExplanation(false);
        else showExplanation(true);
    }
    function update() {
        if (!person) return;
        console.log(person);
        genSuggestion(person).then((value) => {
            console.log(value);
            const parsed = parseOutput(value["choices"][0]["text"]);
            console.log(parsed.explanation);
            console.log(parsed.suggestion);
            message.current = parsed.suggestion;
            setExplanation(parsed.explanation);
        }); 
    }
    function initialize(mutationList, observer) {
        let marker = "https://tinder.com/app/messages/";
        let idx = location.href.indexOf(marker);
        let longID = location.href.slice(idx + marker.length);
        let profiles = document.querySelectorAll(".profile-data");
        for (let i = 0; i < profiles.length; i++) {
            let prof = profiles[i];
            if (longID.includes(prof.id)) {
                if (observer) observer.disconnect();
                let p = {"name": prof.querySelector(".name").innerHTML, "bio": (prof.querySelector(".bio") as HTMLTextAreaElement).innerText, "interests": []};
                console.log(prof.querySelector(".interests"));
                prof.querySelector(".interests").firstElementChild.childNodes.forEach((value: HTMLElement) => {p.interests.push(value.innerHTML)});
                setPerson(p);
                return;
            }
        }
        if (!observer) {
            const profObserver = new MutationObserver(initialize);
            profObserver.observe(document, config);
        }
        
    }
    React.useEffect(() => {initialize(null, null);}, []);
    React.useEffect(update, [person]);
    
    return (!explanation ? (<div style={{padding: "2% 3%"}}>
        <Skeleton variant="text" sx={{fontSize: '1.75rem'}}/> <Skeleton variant="text" sx={{fontSize:'1.75rem'}}/></div>)

        : <div>
        <div>
        <p style={{position: "absolute", left: "3%", right: "3%", fontSize: "2.6vh", height: "50%", overflow: "auto"}}>{showingExplanation ? explanation : ('"' + message.current + '"')}</p>
        </div>
        <div style={{position: "absolute", left: "3%", right: "3%", bottom: 0, fontSize: "3rem"}}>
        <Button sx={{fontSize: "1.1rem"}} variant="text" onClick={() => {toggleExplanation()}}>{!showingExplanation ? "EXPLAIN" : "HIDE"}</Button>
        <Button sx={{fontSize: "1.1rem"}} variant="text" onClick={() => {copyText(message.current)}}>COPY</Button>
        <Button sx={{fontSize: "1.1rem"}} variant="text" onClick={() => {setExplanation(null); update();}}>RETRY</Button>
        </div>
    </div>)
}
function DrawerInner(props) {
    // let nameFound = false;
    // let bioFound = false;
    // let interestsFound = false;
    // let profileElement = null as Element;
    // function findName(mutationList, observer) {
    //     let nameElement = profileElement.querySelector("h1");
    //     if (!nameElement && !observer) {
    //         const nameObserver = new MutationObserver(findName);
    //         nameObserver.observe(profileElement, config);
    //     }
    //     else if (nameElement) {
    //         if (observer) observer.disconnect();
    //         nameFound = true;
    //         p.name = nameElement.innerText;
    //         console.log(p.name);
    //         checkComplete();
    //     }
    // }
    // function findBio(mutationList, observer) {
    //     let bioElement = profileElement?.children?.[1]?.children?.[2] as Element;
    //     if ((!bioElement && !observer) || (bioElement && bioElement.querySelector("h2"))) {
    //         const bioObserver = new MutationObserver(findBio);
    //         bioObserver.observe(profileElement, config);
    //     }
    //     else if (bioElement?.firstElementChild) {
    //         if (observer) observer.disconnect();
    //         let innerBioElement = bioElement.firstElementChild as HTMLElement;
    //         if (innerBioElement.innerText === "") {
    //             p.bio = "<no bio>"
    //         }
    //         else {
    //             p.bio = innerBioElement.innerText;
    //         }
    //         bioFound = true;
    //         console.log(p.bio);
    //         checkComplete();
    //     }
    // }
    // function findInterests(mutationList, observer) {
    //     let interestsElement = null as Element;
    //     let H2s = profileElement.querySelectorAll("h2");
    //     H2s.forEach((value, index, parent) => {
    //         if (value.innerText == "Passions") {
    //             interestsElement = value;
    //         }
    //     });
    //     console.log(interestsElement);
    //     if (!interestsElement && !observer) {
    //         const interestsObserver = new MutationObserver(findInterests);
    //         interestsObserver.observe(profileElement, config);
    //     }
    //     else if (interestsElement) {
    //         let li = interestsElement.nextElementSibling as Element;
    //         if (li) {
    //             if (observer) observer.disconnect();
    //             li.firstElementChild.childNodes.forEach((value, index, parent) => {
    //                 p.interests.push(value.textContent);
    //             });
    //             interestsFound = true;
    //             console.log(p.interests);
    //             checkComplete();
    //         }
    //     }
    // }
    // function findProfile(mutationList, observer) {
    //     profileElement = document.querySelector(".profileContent");
    //     if (!profileElement && !observer) {
    //         const profileObserver = new MutationObserver(findProfile);
    //         profileObserver.observe(document, config);
    //     }
    //     else if (profileElement) {
    //         if (observer) observer.disconnect();
    //         profileElement = profileElement.firstElementChild;
    //         findName(null, null);
    //         findBio(null, null);
    //         findInterests(null, null);
    //     }
    // }
    // React.useEffect(() => {findProfile(null, null)}, [])
    // function checkComplete() {
    //     try {
    //     if (nameFound && bioFound && interestsFound) {
    //         setPerson(p);
    //     }
    //     }
    //     catch(err) {console.log(err);}
    // }
    return (
        <Box>
            <Suggestion></Suggestion> 
        </Box>
    )
}
function App(props) {
    const drawerWidth = 200;
    const [open, setOpen] = React.useState(false);
    /*React.useEffect(() => {
        const observer = new MutationObserver(() => {
            const chatArea = document.querySelector(".chat");
            setTextArea(chatArea?.querySelector("textarea"));
        });

        return () => observer.disconnect();
    }, []);*/

    const handleDrawerOpen = () => {
        setOpen(true);
    }
    const handleDrawerClose = () => {
        setOpen(false);
    }
    const toggleDrawer = () => {
        if (open) handleDrawerClose();
        else handleDrawerOpen();
    }
    const textArea = props.chatArea.querySelector("textarea");
    return (
        <div>
        <Drawer
        sx={{
          position: "relative",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            position: "absolute",
            minHeight: "100px",
            zIndex: 0,
          },
        }}
        variant="persistent"
        anchor="bottom"
        open={open}
      ><DrawerInner textArea={textArea} /></Drawer>
        <Portal container={props.chatArea.childNodes[props.chatArea.childNodes.length - 1].childNodes[0] as Element}>
            <Button variant="outlined" onClick={toggleDrawer}><BrainIcon /></Button>
        </Portal>
    </div>
    )
}   
function BrainIcon() {
    return (
        <svg width="34px" height="34px" viewBox="60 -11 600 600">
            <g>
                <path d="m530.99 304.64c1.125-1.8633 2.1211-3.7969 2.9844-5.793 11.375-26.891-3.5-57.672-8.918-67.375 1.9336-12.312 5.7578-53.262-24.91-68.969-6.1328-3.1602-12.629-5.5625-19.344-7.1562 5.6094-30.406-8.4688-51.793-25.227-59.238-3.8242-1.668-7.8867-2.7109-12.039-3.0898-0.13281-0.12109-0.19141-0.28906-0.33984-0.41016-30.625-24.551-62.246-33.738-82.688-23.949h-0.003907c-4.0273 1.9297-7.6055 4.6836-10.508 8.0781-2.8984-3.3984-6.4766-6.1523-10.5-8.0859-20.422-9.7734-52.105-0.62109-82.688 23.949-0.14844 0.12109-0.21094 0.28906-0.33984 0.41016-4.1562 0.37109-8.2227 1.4141-12.043 3.0898-16.758 7.4453-30.836 28.875-25.227 59.238-6.7148 1.5898-13.211 3.9961-19.344 7.1562-30.625 15.707-26.844 56.656-24.91 68.969-5.418 9.7109-20.336 40.496-8.918 67.375 0.86328 1.9961 1.8594 3.9297 2.9844 5.793-11.336 13.25-14.762 31.535-8.9961 47.992 4.25 14.906 13.652 27.812 26.539 36.426-2.5352 18.949 3.3047 38.062 15.996 52.359 8.1875 10.02 19.609 16.867 32.305 19.363 4.457 10.445 11.957 19.309 21.516 25.441 9.5586 6.1289 20.742 9.2422 32.094 8.9375 3.3359-0.003906 6.668-0.22266 9.9766-0.65625 20.715-1.3516 39.688-12.059 51.555-29.094 11.859 17.047 30.832 27.77 51.555 29.129 3.3086 0.43359 6.6406 0.65234 9.9766 0.65625 11.352 0.30469 22.531-2.8086 32.094-8.9414 9.5586-6.1289 17.055-14.992 21.516-25.438 12.695-2.4961 24.117-9.3438 32.305-19.363 12.691-14.297 18.531-33.41 15.996-52.359 12.891-8.6211 22.297-21.543 26.539-36.461 5.7656-16.453 2.3438-34.734-8.9883-47.984zm-234.77 172.54c-36.594 4.6094-45.77-23.957-46.672-27.188v0.003906c-1.1172-4.1836-5.1211-6.9219-9.4258-6.4414-9.7031-0.80078-18.59-5.7578-24.367-13.598-10.66-12.059-14.684-28.605-10.746-44.215 0.61719-2.4219 0.16797-4.9961-1.2383-7.0664-1.4062-2.0703-3.6289-3.4414-6.1094-3.7656-4.543-0.59375-16.195-11.672-20.879-27.281-3.4453-9.8789-1.9883-20.809 3.918-29.445 11.387 8.7734 24.75 14.605 38.922 16.992 4.6758 0.83984 9.168-2.207 10.117-6.8594 0.94922-4.6562-1.9883-9.2188-6.6172-10.281-21.734-4.4609-35.523-13.203-40.977-25.98-9.9062-23.223 9.1719-53.969 9.3711-54.25v0.003906c1.207-1.9375 1.6211-4.2656 1.1562-6.5039-0.085937-0.41016-8.4102-41.125 15.156-53.207 18.375-9.4219 36.617-9.5469 49.973-0.31641h-0.003907c6.1484 4.4805 10.973 10.539 13.957 17.539 2.9844 7 4.0195 14.676 2.9922 22.215-0.53516 4.8047 2.9297 9.1328 7.7344 9.668s9.1367-2.9297 9.668-7.7344c1.3828-10.688-0.16016-21.547-4.457-31.43-4.3008-9.8789-11.195-18.41-19.953-24.684-9.1367-6.2617-19.91-9.6992-30.984-9.8984-4.4375-21.777 4.0859-36.617 14.754-41.359 12.793-5.6797 27.512 1.6016 38.402 19.004 2.5664 4.1055 7.9766 5.3555 12.082 2.7891 4.1094-2.5625 5.3594-7.9727 2.793-12.082-5.9492-10.223-14.605-18.602-25.016-24.211 23.066-15.102 42.305-17.895 52.195-13.168h-0.003906c3.2305 1.832 5.8398 4.5859 7.4922 7.9102 1.6523 3.3203 2.2773 7.0625 1.793 10.742v83.457c-0.82422-0.65625-1.6172-1.3633-2.4844-1.9531v0.003906c-8.7422-6.1992-20.047-7.4922-29.961-3.4219-2.2148 0.82422-4.0039 2.5078-4.9609 4.668-0.95312 2.1641-0.99219 4.6172-0.10938 6.8086 0.88281 2.1914 2.6172 3.9336 4.8047 4.8281 2.1875 0.89453 4.6445 0.86328 6.8125-0.082031 4.5312-1.8516 9.7031-1.1875 13.621 1.75 8.1094 6.4219 12.668 16.328 12.277 26.66v148.75c-1.4102-1.2773-2.8594-2.5195-4.375-3.6836-9.8164-8.2578-22.891-11.531-35.438-8.8711-4.6406 1.3516-7.3086 6.207-5.957 10.852 1.3477 4.6406 6.207 7.3086 10.848 5.957 7.2422-0.96094 14.547 1.2461 20.047 6.0547 8.7422 6.0938 14.223 15.852 14.875 26.488v27.766c0 0.32031-1.2266 32.512-45.027 38.066zm227.03-129.55c-4.6797 15.609-16.336 26.688-20.879 27.281-2.4805 0.32422-4.7031 1.6953-6.1094 3.7656-1.4062 2.0703-1.8555 4.6445-1.2383 7.0664 3.9375 15.609-0.085938 32.156-10.746 44.215-5.7773 7.8398-14.664 12.797-24.367 13.598-4.2852-0.48047-8.2812 2.2305-9.418 6.3867-0.875 3.2812-10.105 31.91-46.68 27.238-43.836-5.5547-45.062-37.746-45.062-38.07v-253.49c-0.35938-4.2812 1.1797-8.5078 4.207-11.559 5.3438-3.6602 11.824-5.2852 18.262-4.5742 4.8047 0.54297 9.1406-2.9102 9.6836-7.7148 0.54297-4.8008-2.9102-9.1367-7.7148-9.6797-8.3594-0.73828-16.773 0.67188-24.438 4.0938v-53.105c-0.48047-3.6836 0.14844-7.4258 1.8086-10.75s4.2734-6.0742 7.5117-7.9023c9.8867-4.7266 29.129-1.9336 52.195 13.168h-0.003906c-10.406 5.6133-19.066 13.992-25.016 24.211-2.5664 4.1094-1.3164 9.5195 2.793 12.082 4.1055 2.5664 9.5156 1.3164 12.082-2.7891 10.902-17.402 25.609-24.684 38.402-19.004 10.668 4.7422 19.188 19.582 14.754 41.359-11.09 0.1875-21.879 3.6289-31.027 9.8984-8.7578 6.2734-15.656 14.805-19.953 24.684-4.2969 9.8828-5.8398 20.742-4.4609 31.43 0.53516 4.8047 4.8633 8.2695 9.6719 7.7344 2.3047-0.25781 4.418-1.418 5.8672-3.2344 1.4531-1.8125 2.1211-4.1289 1.8672-6.4336-1.0312-7.5469 0.003906-15.227 2.9883-22.23 2.9844-7.0039 7.8125-13.066 13.969-17.547 13.352-9.2305 31.578-9.1094 49.973 0.31641 23.562 12.066 15.242 52.797 15.156 53.207h-0.003906c-0.46484 2.2344-0.050781 4.5625 1.1562 6.5 0.20312 0.30469 19.25 31.055 9.3711 54.25-5.4531 12.773-19.25 21.516-40.977 25.98-2.3203 0.41406-4.375 1.75-5.6992 3.6992-1.3203 1.9492-1.8008 4.3516-1.332 6.6641 0.47266 2.3086 1.8555 4.3281 3.8398 5.6055 1.9805 1.2773 4.3945 1.6992 6.6914 1.1719 14.164-2.3906 27.523-8.2266 38.902-16.992 5.9375 8.6328 7.4102 19.574 3.9727 29.469zm-137.66-91.551c-3.8086-2.9805-4.4844-8.4844-1.5039-12.293 2.9766-3.8125 8.4844-4.4844 12.293-1.5078 17.762 13.867 33.418 18.191 46.551 12.863 16.711-6.7891 26.738-28.297 29.242-46.602 0.65625-4.7891 5.0703-8.1406 9.8594-7.4805 4.7891 0.65625 8.1406 5.0703 7.4844 9.8594-2.957 21.586-15.215 50.363-40.004 60.438h-0.003906c-3.082 1.2266-6.2852 2.1289-9.5547 2.6875 0.78516 3.6484 2.4922 7.0352 4.9609 9.832 5.7891 5.4219 13.566 8.2031 21.48 7.6836 4.8359 0.046875 8.7148 4 8.668 8.832s-4 8.7148-8.832 8.668h-0.15625c-12.84 0.55859-25.309-4.3828-34.273-13.59-5.2773-6.0625-8.625-13.559-9.625-21.531-13.473-2.875-26.035-9.0078-36.586-17.859zm82.066 125.42c-0.066406 4.7852-3.9648 8.6289-8.75 8.6289h-0.085938c-5.9883 0.0625-11.934 1.0273-17.633 2.8594-0.14844 0.0625-0.30469 0.097657-0.46484 0.14844-6.918 2.0352-13.254 5.6797-18.496 10.633-7.4844 7.9336-11.387 18.586-10.805 29.477 0 4.832-3.918 8.75-8.75 8.75-4.8359 0-8.75-3.918-8.75-8.75-0.66406-15.617 5.1562-30.816 16.082-42 5.6914-5.5 12.41-9.8203 19.773-12.723 0.88281-12.266-2.4648-24.469-9.4844-34.57-8.6875-9.957-21.199-15.75-34.414-15.926-4.8164-0.40234-8.3906-4.6328-7.9883-9.4492 0.16406-2.3203 1.2617-4.4766 3.0391-5.9805 1.7773-1.5039 4.0859-2.2266 6.4023-2.0078 18.152 0.46094 35.227 8.7344 46.84 22.699 8.5508 11.738 13.148 25.891 13.125 40.414 3.8672-0.64844 7.7812-1.0039 11.707-1.0586 2.3203 0.027344 4.5391 0.97266 6.1602 2.6328 1.625 1.6641 2.5195 3.9023 2.4922 6.2227zm-247.59-161c-0.57422-4.7422 2.7617-9.0664 7.4922-9.7188 4.7305-0.65234 9.1094 2.6094 9.8398 7.3281 2.5195 18.312 12.539 39.82 29.27 46.602 13.125 5.3359 28.777 1.0078 46.531-12.855l0.003907 0.003906c3.8125-2.8047 9.1641-2.0664 12.078 1.668 2.9141 3.7305 2.3281 9.1016-1.3164 12.121-10.543 8.8516-23.09 14.98-36.551 17.852-0.99219 7.9766-4.3438 15.477-9.625 21.535-8.9688 9.2031-21.434 14.148-34.273 13.598h-0.15625c-4.832 0.042969-8.7891-3.8359-8.832-8.668-0.046876-4.832 3.832-8.7891 8.6641-8.832 7.9727 0.52734 15.805-2.3008 21.598-7.8047 2.4141-2.7773 4.0898-6.1172 4.8711-9.7148-3.2734-0.55469-6.4844-1.457-9.5703-2.6875-24.797-10.07-37.059-38.855-40.023-60.426zm60.375 180.33c10.93 11.18 16.754 26.379 16.09 42 0 4.832-3.918 8.75-8.75 8.75-4.832 0-8.75-3.918-8.75-8.75 0.58203-10.891-3.3242-21.547-10.812-29.477-10.246-8.6523-23.176-13.477-36.586-13.645h-0.078125c-4.832 0.039063-8.7812-3.8477-8.8203-8.6797-0.039063-4.832 3.8477-8.7812 8.6797-8.8203 3.9297 0.019531 7.8477 0.36719 11.719 1.043-0.019531-14.516 4.5781-28.656 13.125-40.391 11.609-13.977 28.684-22.266 46.848-22.75 4.8164-0.40234 9.0469 3.1797 9.4492 8 0.39844 4.8164-3.1797 9.0469-8 9.4492-13.211 0.17969-25.723 5.9766-34.402 15.941-7.0117 10.105-10.355 22.305-9.4766 34.57 7.3633 2.9141 14.078 7.2422 19.773 12.742z"/>
            </g>
        </svg>
    )
}
const config = {attributes: false, childList: true, subtree: true};

const initialize = (mutationList, observer) => {
    if (!document.querySelector("#react-root")) {
        const chatArea = document.querySelector(".chat");
        const textArea = chatArea?.querySelector("textarea");
        const rootElement = document.createElement("div");
        if (chatArea && textArea) {
            console.log("found chat area");
            rootElement.id = "react-root";
            const styles = document.createElement("style");
            styles.innerHTML = `
                #${rootElement.id} {
                }
            `;
            rootElement.appendChild(styles);

            chatArea.insertBefore(rootElement, chatArea.childNodes[chatArea.childNodes.length - 1]);
            (chatArea.childNodes[chatArea.childNodes.length - 1] as HTMLElement).style.zIndex = "5";

            const root = ReactDOM.createRoot(rootElement);
            root.render(
                <React.StrictMode>
                    <App chatArea={chatArea}/>
                </React.StrictMode>
            )
        }
    }
}

// window.onload = (() => {
    const rootObserver = new MutationObserver(initialize);
    // initialize(null, observer);
    rootObserver.observe(document, config);
// });