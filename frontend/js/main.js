const observer = new IntersectionObserver(
    entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(x => observer.observe(x));


// ===============================
// PROJECT INQUIRY FORM
// ===============================

const form = document.getElementById('projectForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', async e => {

    e.preventDefault();

    const formData = new FormData(form);

    const serviceMap = {
        "Web Product": 1,
        "AI & Automation": 2,
        "Application": 4,
        "Custom Software": 4
    };

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        service_id: serviceMap[formData.get('service')],
        budget: formData.get('budget'),
        message: formData.get('message')
    };

    console.log("Sending inquiry:", data);

    note.textContent = 'Sending your brief…';

    try {

        const response = await fetch(
            'http://localhost:5000/api/inquiries',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Submission failed');
        }

        console.log("Server response:", result);

        note.textContent =
            '✓ Brief received. We will get back to you shortly.';

        form.reset();

    } catch (error) {

        console.error("Inquiry error:", error);

        note.textContent =
            '✕ Something went wrong. Please try again.';
    }
});


// ===============================
// LOAD SERVICES FROM ORACLE
// ===============================
async function loadServices() {

    const serviceGrid = document.getElementById('serviceGrid');

    if (!serviceGrid) {
        console.error('serviceGrid not found');
        return;
    }

    const icons = ['⌘', '✦', '◫', '⚙', '◉', '◇'];

    // Demo fallback data
    const demoServices = [
        [
            1,
            "Web Development",
            "Modern, responsive and high-performance websites for businesses and organizations."
        ],
        [
            2,
            "AI & Machine Learning",
            "AI-powered solutions, automation and intelligent data-driven applications."
        ],
        [
            3,
            "Cybersecurity",
            "Security-focused solutions for applications, systems and digital infrastructure."
        ],
        [
            4,
            "Software Development",
            "Custom software applications designed for real-world business requirements."
        ],
        [
            5,
            "Data Analytics",
            "Data analysis, visualization and intelligent insights for better decision making."
        ],
        [
            6,
            "UI/UX Design",
            "Modern user interfaces and user experiences designed for usability and engagement."
        ]
    ];

    let services = demoServices;

    // Try Oracle backend when running locally
    try {

        const response = await fetch(
            'http://localhost:5000/api/services'
        );

        if (response.ok) {

            const oracleServices = await response.json();

            if (oracleServices.length > 0) {
                services = oracleServices;
                console.log(
                    'Services from Oracle:',
                    oracleServices
                );
            }

        }

    } catch (error) {

        console.log(
            'Public demo mode: using demo services.'
        );

    }


    serviceGrid.innerHTML = '';


    services.forEach((service, index) => {

        const serviceName = service[1];
        const description = service[2];

        const card = document.createElement('article');

        card.className =
            'service-card' +
            (index === 0 ? ' large' : '');

        card.innerHTML = `
            <span class="num">
                ${String(index + 1).padStart(2, '0')}
            </span>

            <div>

                <div class="icon">
                    ${icons[index] || '✦'}
                </div>

                <h3>${serviceName}</h3>

                <p>${description}</p>

                <div class="tags">
                    <span>VST</span>
                    <span>Technology</span>
                </div>

            </div>

            <span class="arrow">
                ↗
            </span>
        `;

        serviceGrid.appendChild(card);

    });

}

loadServices();