function simulate() {
    const frames = parseInt(document.getElementById("frames").value);
    const pages = document.getElementById("pages").value.split(" ").map(Number);
    const algo = document.getElementById("algo").value;

    let ram = [];
    let disk = [];
    let faults = 0;
    let steps = [];

    pages.forEach(p => {
        let hit = ram.includes(p);

        if (algo === "lru" && hit) {
            ram = ram.filter(x => x !== p);
            ram.push(p);
        }

        if (!hit) {
            faults++;
            if (ram.length === frames) {
                if (algo === "vm") {
                    disk.push(ram.shift()); // move to disk
                } else {
                    ram.shift();
                }
            }
            ram.push(p);
        }

        steps.push({
            page: p,
            hit,
            ram: [...ram],
            disk: [...disk]
        });
    });

    visualize(steps, faults);
    drawGraph(steps);
}

function visualize(steps, faults) {
    const memory = document.getElementById("memory");
    const diskDiv = document.getElementById("disk");
    const log = document.getElementById("log");

    log.innerHTML = `Total Page Faults: ${faults}<br><br>`;

    steps.forEach(step => {
        log.innerHTML += `Page ${step.page} → ${step.hit ? "HIT" : "FAULT"}<br>`;
    });

    const last = steps[steps.length - 1];

    memory.innerHTML = "";
    last.ram.forEach(p => {
        let div = document.createElement("div");
        div.className = "frame";
        div.innerText = p;
        memory.appendChild(div);
    });

    diskDiv.innerHTML = "";
    last.disk.forEach(p => {
        let div = document.createElement("div");
        div.className = "frame";
        div.innerText = p;
        diskDiv.appendChild(div);
    });
}

function drawGraph(steps) {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    steps.forEach((s, i) => {
        const height = s.hit ? 30 : 100;
        ctx.fillRect(i * 40 + 20, canvas.height - height, 30, height);
    });
}
