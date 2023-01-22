console.log("intercepted!!!");
const { fetch: originalFetch } = window;


window.fetch = async (...args) => {
    let [resource, config ] = args;
    // request interceptor here
    const response = await originalFetch(resource, config);
    // response interceptor here
    const copy = response.clone();
    const marker = "app/messages/";
    if (copy.url.includes("https://api.gotinder.com/user")) {
        let j = await copy.json();
        console.log(copy.url)
        console.log(j);
        let d = document.createElement("div");
        d.style.height = 0;
        d.style.overflow = "hidden";
        d.id = j.results._id;
        d.className = "profile-data";
        let n = document.createElement("div");
        n.className = "name";
        n.innerHTML = j.results.name;
        let b = document.createElement("div");
        b.className = "bio";
        b.innerHTML = j.results.bio;
        let i = document.createElement("div");
        i.className = "interests";
        let ilist = document.createElement("ul");
        j.results.user_interests.selected_interests.forEach((value) => {
            let node = document.createElement("li");
            console.log(value.name);
            node.innerHTML = value.name;
            ilist.appendChild(node);
        })
        i.appendChild(ilist);
        d.appendChild(n);
        d.appendChild(b);
        d.appendChild(i);
        document.body.append(d);
        console.log(j.results.name);
    }
    return response;
};