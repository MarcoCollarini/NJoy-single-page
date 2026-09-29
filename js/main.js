const bar = document.querySelector("#topbar");
addEventListener("scroll", () =>
  bar.classList.toggle("scrolled", scrollY > 30),
);
const toggle = document.querySelector(".nav-toggle"),
  nav = document.querySelector("#nav");
toggle.addEventListener("click", () => {
  const o = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", o);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }),
);
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((x) => io.observe(x));
document.querySelectorAll(".filters button").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".filters button")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    document
      .querySelectorAll(".dish")
      .forEach((d) =>
        d.classList.toggle(
          "hidden",
          b.dataset.filter !== "all" && d.dataset.type !== b.dataset.filter,
        ),
      );
  }),
);
const countObserver = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = 1;
      const n = +e.target.dataset.count,
        start = performance.now();
      function tick(t) {
        const p = Math.min((t - start) / 1300, 1),
          v = Math.round(n * (1 - Math.pow(1 - p, 3)));
        e.target.textContent = n === 45 ? (v / 10).toFixed(1) + "+" : v + "+";
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }),
  { threshold: 0.5 },
);
document
  .querySelectorAll("[data-count]")
  .forEach((x) => countObserver.observe(x));
const lb = document.querySelector(".lightbox"),
  lbImg = lb.querySelector("img");
document.querySelectorAll(".photo").forEach((p) =>
  p.addEventListener("click", () => {
    lbImg.src = p.dataset.img;
    lbImg.alt = p.querySelector("img").alt;
    lb.classList.add("open");
    lb.querySelector("button").focus();
  }),
);
function closeLb() {
  lb.classList.remove("open");
  lbImg.src = "";
}
lb.querySelector("button").onclick = closeLb;
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLb();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLb();
});
document.querySelector("#bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.currentTarget.querySelector(".form-status").textContent =
    "Demo completata: la richiesta non è stata realmente inviata.";
});

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       CALENDAR
    ========================== */

    const calendarDays = document.getElementById("calendarDays");
    const calendarMonth = document.getElementById("calendarMonth");
    const selectedDateLabel = document.getElementById("selectedDateLabel");
    const dateInput = document.getElementById("bookingDate");

    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    const today = new Date();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let selectedDate = null;


    const monthNames = [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre"
    ];


    function renderCalendar() {

        calendarDays.innerHTML = "";

        calendarMonth.textContent =
            `${monthNames[currentMonth]} ${currentYear}`;


        const firstDay = new Date(
            currentYear,
            currentMonth,
            1
        );

        const lastDay = new Date(
            currentYear,
            currentMonth + 1,
            0
        );

        // lunedì = 0
        let startDay = firstDay.getDay() - 1;

        if (startDay < 0) {
            startDay = 6;
        }


        // giorni vuoti iniziali
        for (let i = 0; i < startDay; i++) {

            const empty = document.createElement("div");

            empty.className = "calendar-day empty";

            calendarDays.appendChild(empty);
        }


        for (let day = 1; day <= lastDay.getDate(); day++) {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "calendar-day";
            button.textContent = day;


            const date = new Date(
                currentYear,
                currentMonth,
                day
            );

            // disabilita date passate
            const todayOnly = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );

            if (date < todayOnly) {
                button.classList.add("disabled");
            }


            // oggi
            if (
                date.getTime() === todayOnly.getTime()
            ) {
                button.classList.add("today");
            }


            // data selezionata
            if (
                selectedDate &&
                date.getTime() === selectedDate.getTime()
            ) {
                button.classList.add("selected");
            }


            button.addEventListener("click", () => {

                if (button.classList.contains("disabled")) {
                    return;
                }

                selectedDate = date;

                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");

                dateInput.value = `${yyyy}-${mm}-${dd}`;


                selectedDateLabel.textContent =
                    date.toLocaleDateString("it-IT", {
                        weekday: "short",
                        day: "numeric",
                        month: "long"
                    });


                renderCalendar();

                // abilita gli orari
                document
                    .querySelectorAll(".time-slot")
                    .forEach(slot => {
                        slot.classList.remove("disabled");
                    });
            });


            calendarDays.appendChild(button);
        }
    }


    prevMonth.addEventListener("click", () => {

        const current = new Date(
            currentYear,
            currentMonth,
            1
        );

        const minimum = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        current.setMonth(current.getMonth() - 1);

        if (current < minimum) {
            return;
        }

        currentMonth = current.getMonth();
        currentYear = current.getFullYear();

        renderCalendar();
    });


    nextMonth.addEventListener("click", () => {

        currentMonth++;

        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    });


    renderCalendar();


    /* ==========================
       TIME SLOTS
    ========================== */

    const timeInput = document.getElementById("bookingTime");

    document.querySelectorAll(".time-slot").forEach(slot => {

        slot.addEventListener("click", () => {

            if (!selectedDate) {
                return;
            }

            document
                .querySelectorAll(".time-slot")
                .forEach(item => {
                    item.classList.remove("selected");
                });

            slot.classList.add("selected");

            timeInput.value = slot.dataset.time;
        });

    });


    /* ==========================
       CUSTOM SELECTS
    ========================== */

    const customSelects =
        document.querySelectorAll("[data-select]");


    customSelects.forEach(select => {

        const trigger =
            select.querySelector(".custom-select-trigger");

        const triggerText =
            trigger.querySelector("span");

        const hiddenInput =
            select.querySelector("input[type='hidden']");

        const options =
            select.querySelectorAll(".custom-select-menu button");


        trigger.addEventListener("click", e => {

            e.stopPropagation();

            customSelects.forEach(other => {

                if (other !== select) {
                    other.classList.remove("open");

                    other
                        .querySelector(".custom-select-trigger")
                        ?.setAttribute("aria-expanded", "false");
                }

            });

            const open = select.classList.toggle("open");

            trigger.setAttribute(
                "aria-expanded",
                open
            );
        });


        options.forEach(option => {

            option.addEventListener("click", () => {

                triggerText.textContent =
                    option.textContent.trim();

                hiddenInput.value =
                    option.dataset.value;

                options.forEach(item =>
                    item.classList.remove("selected")
                );

                option.classList.add("selected");

                select.classList.remove("open");

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });

    });


    // chiude i dropdown cliccando fuori
    document.addEventListener("click", () => {

        customSelects.forEach(select => {

            select.classList.remove("open");

            select
                .querySelector(".custom-select-trigger")
                ?.setAttribute("aria-expanded", "false");

        });

    });

});
