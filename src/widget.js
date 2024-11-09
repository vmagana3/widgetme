class AgendaMedizonaWidget extends HTMLElement {
    constructor(){
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.wrapperPrincipal = document.createElement("div");
        this.showCalendar = this.getAttribute("showCalendar") !== null;
        this.currentDate = this.getCurrentDate();
    }
    
    connectedCallback(){
        this.initWidget();
    }

    initWidget(){
        const width = this.getAttribute("width") || "100%";
        this.wrapperPrincipal.setAttribute("class", "wrapperPrincipal");
         

        const wrapperAppointments = document.createElement("div");
        wrapperAppointments.setAttribute("class", "wrapperAppointments");

        //DIV LEFT AND RIGHT
        const divLeft = document.createElement("div");
        divLeft.setAttribute("class","divLeft");
        divLeft.setAttribute("id", "todayAppointment");

        const divRight = document.createElement("div");
        divRight.setAttribute("class","divRight");
        divRight.setAttribute("id", "listAppointments");

        wrapperAppointments.appendChild(divLeft);
        wrapperAppointments.appendChild(divRight);

        const style =  document.createElement("style");
         style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
            
            .wrapperPrincipal{
                background-color:white;
                width:${width};
                height:auto;
                border:1px solid #D5D8E3;
                border-radius:16px;
                padding:15px;
                display:flex;
                font-family: "Figtree", sans-serif;
            }

            .wrapperAppointments{
                background-color:white;
                width:${this.showCalendar? "100%":"50%"};
                height:auto;
                display:flex;
            }

            .divLeft{
                display:flex;
                flex-direction:column;
                width:50%;
            }

            .divRight{
                display:flex;
                flex-direction:column;
                width:50%;
            } 

            .todayDateDiv{
                display:flex;
                flex-direction:column;
                width:100%;
            }

            .dayName{
                margin:0;   
                color:#D9214E;
                font-size:30px;
            }

            .dayNumber{
                margin:0;
                color:#3F4254;
                font-size:50px;
            }
        `;

        
        this.wrapperPrincipal.appendChild(wrapperAppointments);
        this.shadow.appendChild(this.wrapperPrincipal);
        this.shadow.appendChild(style);

        this.getAppointmentData();
    }

    createItem(styles, data){
        const appointmentItem = document.createElement("div");
        appointmentItem.setAttribute("class", "appointmentItem");

        const point = document.createElement("div");
        point.setAttribute("class", "divPoint");

        const divTitle = document.createElement("div");
        divTitle.setAttribute("class", "divTitle");

        const appointmentTitle = document.createElement("p");
        appointmentTitle.textContent = 'Cirugía';
        appointmentTitle.setAttribute("class", "appointmentTitle");


        const appointmentDetails = document.createElement("div");
        appointmentDetails.setAttribute("class", "appointmentDetails");

        const patientName = document.createElement("p");
        patientName.textContent = 'Camilo Gándara';
        patientName.setAttribute("class", "patientName");

        const appointmentDate =  document.createElement("p");
        appointmentDate.textContent = '6:30 P.M. - 7:30 P.M.';
        appointmentDate.setAttribute("class","appointmentDate");


        divTitle.appendChild(point);
        divTitle.appendChild(appointmentTitle);
        appointmentItem.appendChild(divTitle);
        appointmentDetails.appendChild(patientName);
        appointmentDetails.appendChild(appointmentDate);

        const style =  document.createElement("style");

        style.textContent = `
            .appointmentItem{
                width:100%;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                border-left:4px solid ${styles.borderColor};
                border-radius: 0px 0px 0px 0px;
                padding:0px 0px 0px 4px;
                margin:0px 0px 10px 0px;
            }

            .divTitle{
                width:100%;
                display:flex;
                justify-content:flex-start;
                align-items:center;
            }

            .divPoint{
                width:5px;
                height:5px;
                display: ${styles?.pointColor ? 'block':'none'};
                background-color:${styles?.pointColor};
                border-radius:100%
                margin:0px 4px 0px 0px;
            }
                
            .appointmentTitle{
                color:#181C32;
                font-weight:bold;
                font-size:18px;
                margin:5px 0px 10px 0px;
            }

            .appointmentDetails{
                color:#7E8299;
                display:flex;
                flex-direction:column;
                justify-content: flex-end;
            }
                
            .patientName{
                margin:0;
                font-size:14px;
            }

            .appointmentDate{
                margin:0;
                font-size:14px;
                font-weight:bold;
            }
        `;
        appointmentItem.appendChild(appointmentDetails);
        appointmentDetails.appendChild(style);
        console.log("ITEM:", appointmentItem);
        console.log("styles", style);
        console.log("-----------------------");

        //Retorna el item del appointment
        return appointmentItem;

    };

    getAppointmentData(){
        //Petición de appointments
        //Recorremos cada appointment y ejecutamos createItem por cada uno

        this.printData();
        
    }

    printData(){

        for(let i = 0; i<3; i++){
            const parentRight = this.shadow.getElementById("listAppointments");
            parentRight.appendChild(this.createItem({
                borderColor:'#34367F',
            },[]));
        }

        const parentLeft =  this.shadow.getElementById("todayAppointment");
        
        const todayDate = document.createElement("div");
        const dayNumber = document.createElement("p");
        const dayName = document.createElement("p");

        todayDate.setAttribute("class","todayDateDiv");
        dayNumber.setAttribute("class", "dayNumber");
        dayName.setAttribute("class", "dayName");

        console.log("Current date:", this.currentDate);

        dayName.textContent = this.currentDate.name;
        dayNumber.textContent = this.currentDate.number;
        todayDate.appendChild(dayName);
        todayDate.appendChild(dayNumber);
        parentLeft.appendChild(todayDate);
        parentLeft.appendChild(this.createItem({
            borderColor:'#E75B0B',
            pointColor:'#E75B0B',
        },[]));

        
    }

    getCurrentDate(){
        const today = new Date();

        // Obtener los componentes de la fecha (año, mes y día)
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 porque los meses empiezan desde 0
        const day = String(today.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos

        const dayNumber = today.getDay();
        // Formatear la fecha como "YYYY-MM-DD"
        const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate); // Ejemplo: "2024-05-10"

        let dayName = '';
        switch(dayNumber){
            case 0:
                dayName = "Domingo"
            break;
            case 1:
                dayName = "Lunes"
            break;
            case 2:
                dayName = "Martes"
            break;
            case 3:
                dayName = "Miércoles"
            break;
            case 4:
                dayName = "Jueves"
            break;
            case 5:
                dayName = "Viernes"
            break;
            case 6:
                dayName = "Sábado"
            break;
            
        }
        return {
            name:dayName,
            number:day,
            formatted:`${year}-${month}-${day}`,
        };
    }

    // createAppointmentItem(){
    //     console.log("ENTRANDO A LA SEGUNDA FUNCION", this.shadow);


    //     const wrapperAppointments = document.createElement("div");
    //     wrapperAppointments.setAttribute("class", "wrapperAppointments");
        

    //     //DIV LEFT AND RIGHT
    //     const divLeft = document.createElement("div");
    //     divLeft.setAttribute("class","divLeft");

    //     const divRight = document.createElement("div");
    //     divRight.setAttribute("class","divRight");
       

    //     //DATE APPOINTMENT ITEMS
    //     const dateP = document.createElement("p");
    //     dateP.setAttribute("class", "mainDate");

    //     const appointmentItem = document.createElement("div");
    //     appointmentItem.setAttribute("class", "appointmentItem");

    //     const appointmentTitle = document.createElement("p");
    //     appointmentTitle.textContent = 'Cirugía';


    //     const appointmentDetails = document.createElement("div");
    //     const patientName = document.createElement("p");
    //     patientName.textContent = 'Camilo Gándara';
    //     patientName.setAttribute("class", "patientName");
    //     const appointmentDate =  document.createElement("p");
    //     appointmentDate.textContent = '6:30 P.M. - 7:30 P.M.';
    //     appointmentDate.setAttribute("class","appointmentDate");


    //     appointmentDetails.appendChild(patientName);
    //     appointmentDetails.appendChild(appointmentDate);

    //     appointmentTitle.setAttribute("class", "appointmentTitle");
    //     appointmentDetails.setAttribute("class", "appointmentDetails");
       

    //     const style =  document.createElement("style");
    //     style.textContent = `
    //         .wrapperAppointments{
    //              background-color:white;
    //              width:${Boolean(this.showCalendar) ? "100%":"50%"};
    //              height:auto;
    //              display:flex;
    //         }

    //         .divLeft{
    //             display:flex;
    //             flex-direction:column;
    //             width:50%;
    //             background-color:green;
    //         }

    //         .divRight{
    //             display:flex;
    //             flex-direction:column;
    //             width:50%;
    //         }    
                
    //         .mainDate{
    //             width:100%
    //             display:flex;
    //             flex-direction:column;
    //         }

    //         .appointmentItem{
    //             width:100%;
    //             display:flex;
    //             flex-direction:column;
    //             justify-content:space-between;
    //             border-left:3px solid blue;
    //             padding:0px 0px 0px 3px;
    //         }

    //         .appointmentTitle{
    //             color:#181C32;
    //             font-wight:bold;
    //             font-size:20px;
    //             margin:5px 0px 5px 0px;
    //         }

    //         .appointmentDetails{
    //             color:#7E8299;
    //             display:flex;
    //             flex-direction:column;
    //             justify-content: flex-end;
    //         }

    //         .patientName{
    //             margin:0;
    //         }

    //         .appointmentDate{
    //             margin:0;
    //         }
    //     `;

    //     console.log("STYLEEEEEE:", style);

    //     
    //     appointmentItem.appendChild(appointmentTitle);
    //     appointmentItem.appendChild(appointmentDetails);

        
    //     wrapperAppointments.appendChild(style);

    //     this.wrapperPrincipal.appendChild(wrapperAppointments);


    // }
}

customElements.define("agenda-widget", AgendaMedizonaWidget);