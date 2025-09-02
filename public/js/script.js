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

const helpfulBtn = document.getElementById("helpfulBtn");
const wrongBtn = document.getElementById("wrongBtn");
const feedbackMsg = document.getElementById("feedback-msg");

async function sendFeedback(type) {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    if (res.ok) {
      feedbackMsg.textContent = "תודה על המשוב 🙏";
    } else {
      feedbackMsg.textContent = "שגיאה בשליחה 😕";
    }
  } catch (err) {
    feedbackMsg.textContent = "שגיאת רשת 😕";
  }
}

helpfulBtn.addEventListener("click", () => sendFeedback("helpful"));
wrongBtn.addEventListener("click", () => sendFeedback("wrong"));
