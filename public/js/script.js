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