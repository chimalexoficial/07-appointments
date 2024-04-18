const patientInput = document.querySelector('#patient');
const ownerInput = document.querySelector('#owner');
const emailInput = document.querySelector('#email');
const dateInput = document.querySelector('#date');
const symptomsInput = document.querySelector('#symptoms');
const form = document.querySelector('#form-appointment');
const containerAppointments = document.querySelector('#appointments');
const formInput = document.querySelector('#form-appointment input[type="submit"]')
// const btnEdit = document.querySelector('btn-edit');
let editing;

// Events
patientInput.addEventListener('change', detailsAppointment);
ownerInput.addEventListener('change', detailsAppointment);
emailInput.addEventListener('change', detailsAppointment);
dateInput.addEventListener('change', detailsAppointment);
symptomsInput.addEventListener('change', detailsAppointment);
form.addEventListener('submit', submitAppointment);
// btnEdit?.addEventListener('click', () => console.log('......'))

// Appointment object
const appointmentObj = {
    id: generateID(),
    patient: '',
    owner: '',
    email: '',
    date: '',
    symptoms: ''
};


class Notification {
    constructor({ text, type }) {
        this.text = text;
        this.type = type;

        this.show();
    };

    show() {
        // notification create
        const alert = document.createElement('div');
        alert.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm');

        const previousAlert = document.querySelector('.alert');

        previousAlert?.remove();

        if (this.type === 'error') {
            alert.classList.add('bg-red-500');
        } else {
            alert.classList.add('bg-green-500');
        }
        alert.textContent = this.text;
        form.parentElement.insertBefore(alert, form);

        // Removing alert
        setTimeout(() => {
            alert.remove();
        }, 2500);
    }
}

class AdminAppointments {
    constructor() {
        this.appointments = [];
        console.log(this.appointments);
    }

    add(appointment) {
        this.appointments = [...this.appointments, appointment];
    }

    edit(updatedAppointment) {
        this.appointments = this.appointments.map(appointment => appointment.id === updatedAppointment.id ? updatedAppointment : appointment) 
        this.showAppointment();
    }

    delete(id) {
        this.appointments = this.appointments.filter(appointment => appointment.id !== id);
        this.showAppointment();
    }

    showAppointment() {
        // Clean HTML
        while (containerAppointments.firstChild) {
            containerAppointments.removeChild(containerAppointments.firstChild)
        }

        if(this.appointments.length === 0) {
            containerAppointments.innerHTML = `<p class="text-xl mt-5 mb-10 text-center">There are no patients</p>`;
        }

        // Appointments
        this.appointments.forEach(appointment => {
            const divAppointment = document.createElement('div');
            divAppointment.classList.add('mx-5', 'my-10', 'shadow-md', 'px-5', 'py-10', 'rounded-xl');

            // Patient
            const patient = document.createElement('p');
            patient.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
            patient.innerHTML = `<span class="font-bold uppercase">Patient: </span>${appointment.patient}`;

            // Owner
            const owner = document.createElement('p');
            owner.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
            owner.innerHTML = `<span class="font-bold uppercase">Owner: </span>${appointment.owner}`;

            // Email
            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
            email.innerHTML = `<span class="font-bold uppercase">Email: </span>${appointment.email}`;

            // Date
            const date = document.createElement('p');
            date.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
            date.innerHTML = `<span class="font-bold uppercase">Date: </span>${appointment.date}`;

            // Symptoms
            const symptoms = document.createElement('p');
            symptoms.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
            symptoms.innerHTML = `<span class="font-bold uppercase">Symptoms: </span>${appointment.symptoms}`;

            // Buttons
            const btnEdit = document.createElement('button');
            btnEdit.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-edit');
            btnEdit.innerHTML = 'Edit <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

            const cloneAppointment = { ...appointment };
            btnEdit.onclick = () => {
                loadAppointment(cloneAppointment);
            };

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnDelete.innerHTML = 'Delete <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnDelete.onclick = () => {
                this.delete(appointment.id);
            };





            const containerButtons = document.createElement('div');
            containerButtons.classList.add('flex', 'justify-between', 'mt-10');
            containerButtons.appendChild(btnEdit);
            containerButtons.appendChild(btnDelete);

            divAppointment.appendChild(patient);
            divAppointment.appendChild(owner);
            divAppointment.appendChild(email);
            divAppointment.appendChild(date);
            divAppointment.appendChild(symptoms);
            divAppointment.appendChild(containerButtons);
            containerAppointments.appendChild(divAppointment);
        });
    }
}

// Functions 
function detailsAppointment(e) {
    appointmentObj[e.target.name] = e.target.value;
    console.log(appointmentObj);
}

const appointments = new AdminAppointments();

function submitAppointment(e) {
    e.preventDefault();

    if (Object.values(appointmentObj).some(item => item.trim() === '')) {
        new Notification({
            text: 'All fields are required',
            type: 'error'
        });
        return;
    };

    if (editing) {
        appointments.edit({...appointmentObj});
        new Notification({ text: 'Patient saved successfully', type: 'success' });
    } else {
        appointments.add({ ...appointmentObj });
        new Notification({ text: 'Done! Added to the list', type: 'success' });
    }

    
    appointments.showAppointment();
    form.reset();
    formInput.value = 'Register now';
    resetAppointmentObject();
    editing = false;

}

function resetAppointmentObject() {
    // appointmentObj.id = generateID();
    // appointmentObj.patient = '';
    // appointmentObj.owner = '';
    // appointmentObj.email = '';
    // appointmentObj.date = '';
    // appointmentObj.symptoms = '';

    Object.assign(appointmentObj, {
        id: generateID(),
        patient: '',
        owner: '',
        email: '',
        date: '',
        symptoms: ''
    });
}

function loadAppointment(appointment) {
    Object.assign(appointmentObj, appointment);
    patientInput.value = appointment.patient;
    ownerInput.value = appointment.owner;
    emailInput.value = appointment.email;
    dateInput.value = appointment.date;
    symptomsInput.value = appointment.symptoms;
    editing = true;

    formInput.value = 'Save changes'
}

function generateID() {
    return Math.random().toString(36).substring(2) + Date.now();
}





