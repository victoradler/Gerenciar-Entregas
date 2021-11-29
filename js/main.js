class ManageDeliveries {
    constructor() {
        this.data = [];
        this.dbName = "@dbGerenciarEntregas";

        this.tableContent = document.querySelector("table tbody");        
        this.buttonSaveDelivery = document.querySelector(".save-delivery");
        this.buttonSaveEditDelivery = document.querySelector(".save-edit-delivery");
        this.buttonAddDelivery = document.querySelector(".add-delivery");
        this.buttonDeliveryEdit = document.querySelector(".delivery-edit");
        
        this.deliveryToEditId = null;
        
        this.init();
    }

    init() {
        this.tableContent.innerHTML = null;
        this.getLocalStorageData();
        this.deliveryDelete();
        
        this.buttonAddDelivery.addEventListener('click', e => {
            this.buttonSaveEditDelivery.classList.add('hidden');
            this.buttonSaveDelivery.classList.remove('hidden');
        });

        this.buttonSaveDelivery.addEventListener('click', e => { 
            const title = this.getInputByIdValue("input-title");
            const description =  this.getInputByIdValue("input-description");
            const deliveryDate =  this.getInputByIdValue("input-delivery-date");   

            if (!title) return;
            if (!description) return;
            if (!deliveryDate) return;
            
            const newDelivery = {
                id: Math.random(Math.floor()),
                title,
                description,
                deliveryDate,
                delivered: false,
            };

            const newData = [...this.data, newDelivery];

            this.setLocalStorageData(newData);
        });     

        this.buttonSaveEditDelivery.addEventListener('click', e =>{
            const title = this.getInputByIdValue("input-title");
            const description =  this.getInputByIdValue("input-description");
            const deliveryDate =  this.getInputByIdValue("input-delivery-date");

            if (!title) return;
            if (!description) return;
            if (!deliveryDate) return;

            const newData = this.data.map(delivery => {
                if (delivery.id === this.deliveryToEditId) {
                    return { 
                        ...delivery,
                        title,
                        description,
                        deliveryDate,
                    }
                }
                return delivery;
            });

            this.setLocalStorageData(newData);
            this.deliveryToEditId = null;
        });
    }

    getLocalStorageData() {
        const getDataResponse = JSON.parse(localStorage.getItem(this.dbName));    
        if (!getDataResponse) return;

        this.data = getDataResponse;
        this.renderTableContent();
        this.addEventListenerToDeleteButtons();
        this.addEventListenerToEditButtons();
        
    }

    setLocalStorageData(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
        this.getLocalStorageData();
    }

    renderTableContent() {
        this.tableContent.innerHTML = null;

        if(this.data.length < 0) return;

        this.data.map(delivery => {
            const tableContentRow = document.createElement("tr");

            tableContentRow.innerHTML = `
                <th scope="row">${delivery.id}</th>
                <td>${delivery.title}</td>
                <td>${delivery.description}</td>
                <td>${delivery.deliveryDate}</td>
                <td>
                    <div class="form-check form-switch">
                        <input 
                            class="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            id="flexSwitchCheckChecked"
                            ${delivery.delivered && 'checked'} 
                        >
                    </div>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button 
                            class="btn btn-secondary delivery-edit"  
                            delivery-id="${delivery.id}"
                            type="button"
                            data-bs-toggle="modal" 
                            data-bs-target="#adicionarEntrega">Editar</button>
                        <button class="btn btn-danger delivery-delete" delivery-id="${delivery.id}">Excluir</button>
                    </div>
                </td>
            `;

            this.tableContent.append(tableContentRow);
        })
    }

    getInputByIdValue(inputNameId) {
        const inputValue = document.getElementById(inputNameId).value;
        return inputValue || null;
    }

    addEventListenerToDeleteButtons(){
        const deleteButtons = Array.from(document.querySelectorAll(".delivery-delete"));

        deleteButtons.map(deleteButton => {
            deleteButton.addEventListener('click', () => {
                this.deliveryDelete(Number(deleteButton.getAttribute('delivery-id')));
            })
        });           
    }

    addEventListenerToEditButtons(){
        const editButtons = Array.from(document.querySelectorAll(".delivery-edit"));

        editButtons.map(editButton => {
            editButton.addEventListener('click', () => {
                const deliveryId = Number(editButton.getAttribute('delivery-id'));
                this.buttonSaveEditDelivery.classList.remove('hidden');
                this.buttonSaveDelivery.classList.add('hidden');
                this.setInputToEdit(deliveryId);
                this.deliveryToEditId = deliveryId;
            })
        });           
    }

    setInputToEdit(deliveryId) {
        const deliveryToEdit = this.data.filter(delivery => delivery.id === deliveryId)[0];
        this.setInputValue(
            deliveryToEdit.title,
            deliveryToEdit.description,
            deliveryToEdit.deliveryDate,
        )
    }

    deliveryDelete(deliveryId) {
        const newData = this.data.filter(delivery => delivery.id !== deliveryId);

        this.setLocalStorageData(newData);
    }

    setInputValue(title, description, deliveryDate) {
        document.getElementById('input-title').value = title;
        document.getElementById('input-description').value = description;
        document.getElementById('input-delivery-date').value = deliveryDate;
    }
}

new ManageDeliveries()
