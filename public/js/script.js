fetch("/api/status")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        document.body.className=data.status;
        if(data.status === "open"){
            document.getElementById("status").textContent="החנות פתוחה ";
        }
        else if(data.status === "busy"){
            document.getElementById("status").textContent="החנות עמוסה ";
        }
        else{
            document.getElementById("status").textContent="החנות סגורה ";
        } 
    if (data.lastUpdated) {
      const dt = new Date(data.lastUpdated);
      const il = dt.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", hour12: false });
      document.getElementById("status-time").textContent = "עדכון אחרון: " + il;
    }
    })
    .catch(error => console.error('Error fetching data:', error));

    const openHoursBtn = document.getElementById("openHoursBtn");
    const hoursModal = document.getElementById("hoursModal");
    const closeBtn = document.querySelector(".close-btn");

    if (openHoursBtn) {
    openHoursBtn.addEventListener("click", () => {
        hoursModal.style.display = "block";
    });
    }

    if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        hoursModal.style.display = "none";
    });
    }

    window.addEventListener("click", (e) => {
    if (e.target === hoursModal) {
        hoursModal.style.display = "none";
    }
    });
