            const password = "1405";
            const input = prompt("הכנס סיסמה:");
            if (input !== password) {
                alert("סיסמה שגויה! אין לך גישה לעמוד זה.");
                window.location.href = "index.html"; 
            }
            fetch("/api/status")
            .then(res => res.json())
            .then(data => {
                document.getElementById("lastStatus").textContent = "סטטוס נוכחי: " + (data.status === "open" ? "פנוי" : data.status === "busy" ? "עמוס" : "סגור");
                if (data.lastUpdated) {
                const dt = new Date(data.lastUpdated);
                const il = dt.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", hour12: false });
                document.getElementById("lastUpdate").textContent = "סטטוס עודכן לאחרונה: " + il;
                }
            })
            .catch(err => console.error("בעיה בטעינת הסטטוס:", err));



            let selectedStatus = null;
            document.querySelectorAll(".status-buttons button").forEach(button => {
                button.addEventListener("click", () => {
                selectedStatus = button.value; 
                console.log("בחרת:", selectedStatus);
            });
            });
            const buttons = document.querySelectorAll(".status-buttons button");

            buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(b => b.classList.add("inactive"));
                button.classList.remove("inactive");
            });
            });
           document.querySelector(".save").addEventListener("click", async () => {
        if (!selectedStatus) {
            alert("בחר סטטוס לפני השמירה!");
            return;
        }

        try {
            const res = await fetch("/api/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: selectedStatus }) 
            });
            if (!res.ok) throw new Error("Server error");

            const data = await res.json(); 
            const il = new Date(data.lastUpdated)
            .toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", hour12: false });

            document.getElementById("message").textContent =
            "הסטטוס נשמר בהצלחה! (" + il + ")";

            document.getElementById("lastUpdate").textContent =
            "סטטוס עודכן לאחרונה: " + il;

            document.getElementById("lastStatus").textContent =
            "סטטוס נוכחי: " +
            (data.status === "open"
                ? "פנוי"
                : data.status === "busy"
                ? "עמוס"
                : "סגור");

        } catch (err) {
            console.error("בעיה בעדכון:", err);
            alert("נכשל בעדכון הסטטוס");
        }
        });
                
