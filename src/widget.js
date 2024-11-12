class AgendaMedizonaWidget extends HTMLElement {
    constructor(){
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.wrapperPrincipal = document.createElement("div");
        this.showCalendar = this.getAttribute("showCalendar") === "true";
        this.width = this.getAttribute("width") || "100%";
        this._currentDate = this.getCurrentDate();
        this._appointmentList = [];
        this.currentAppointmentItem = {};
    }

    
    set currentDate(value){
        this._currentDate = value;
        console.log("Cambio de valor de curren date ---");
        this.initWidget();
    }

    set appointmentList(value){
        this._appointmentList = value;
        console.log("Se setearon los appointments ---");
        this.createAppointmentsComponent();
    }
    
    connectedCallback(){
        this.shadow.replaceChildren();
        this.initWidget();
    }

    initWidget(){
        console.log("CURRENT DATE:", this._currentDate);
        if(this.showCalendar){
            this.createCalendarComponent();
        }else{
            this.getAppointmentData();
        }

        //DIV MAIN
        this.wrapperPrincipal.setAttribute("class", "wrapperPrincipal");

        const style =  document.createElement("style");
         style.textContent = `
         
            @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Montserrat:wght@100..900&display=swap');
            
            .wrapperPrincipal{
                width:${this.width};
                height:auto;
                border:1px solid #D5D8E3;
                border-radius:16px;
                padding:15px;
                display:flex;
                font-family: "Figtree", sans-serif;
            } 
        `;

        this.shadow.appendChild(this.wrapperPrincipal);
        this.shadow.appendChild(style);

    }

    createAppointmentsComponent(){

        //WRAPPER APPOINTMENTS
        let wrapperAppointments = this.shadow.querySelector(".wrapperAppointments");
        if(wrapperAppointments){
            wrapperAppointments.replaceChildren();
        }else{
            wrapperAppointments = document.createElement("div");
            wrapperAppointments.setAttribute("class", "wrapperAppointments");
            this.wrapperPrincipal.appendChild(wrapperAppointments);
        }
        
        
        //DIV LEFT AND RIGHT
        const divLeft = document.createElement("div");
        divLeft.setAttribute("class","divLeft");
        divLeft.setAttribute("id", "todayAppointment");

        const divRight = document.createElement("div");
        divRight.setAttribute("class","divRight");
        divRight.setAttribute("id", "listAppointments");

        const style =  document.createElement("style");

        style.textContent = `
           .wrapperAppointments{
               width:${this.showCalendar? "100%":"50%"};
               height:80%;
               display:flex;
               margin:0px 0px 0px 15px;
           }

           .divLeft{
               display:flex;
               flex-direction:column;
               width:50%;
               justify-content:space-between;
           }

           .divRight{
               display:flex;
               flex-direction:column;
               justify-content:space-between;
               width:50%;
           } 
       `;

        wrapperAppointments.appendChild(divLeft);
        wrapperAppointments.appendChild(divRight);
        wrapperAppointments.appendChild(style);
        

        this.printCurrentAppointment();
        this.printAppointmentList();
    }

    createCalendarComponent(){
        let divCalendar = this.shadow.querySelector(".divCalendar");
        
        if(divCalendar){
            divCalendar.replaceChildren();
        }else{
            //DIV CALENDAR
            divCalendar = document.createElement("div");
            divCalendar.setAttribute("class", "divCalendar");
            divCalendar.setAttribute("id", "calendarDiv");
            this.wrapperPrincipal.appendChild(divCalendar);
        }
        

        //CALENDAR MONTH AND YEAR
        const monthYear = document.createElement("div");
        monthYear.setAttribute("class", "monthYearDiv");
        

        const monthText = document.createElement("p");
        monthText.setAttribute("class", "monthText");
        monthText.textContent = this._currentDate.monthName;

        const yearText = document.createElement("p");
        yearText.setAttribute("class", "yearText");
        yearText.textContent = this._currentDate.year;

        //CALENDAR HEADER
        const headerDays =  document.createElement("div");
        headerDays.setAttribute("class", "headerDays");

        //CALENDAR GRID
        const gridMonth = document.createElement("div");
        gridMonth.setAttribute("class", "gridMonth");
        gridMonth.setAttribute("id", "grid");


        const style = document.createElement("style");
        style.textContent = `
            .divCalendar{
                display:flex;
                flex-direction:column;
                width:50%;
                height:auto;
            }

            .monthYearDiv{
                width:70%;
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin:0px 0px 20px 0px;
            }

            .monthText{
                font-size:24px;
                font-weight:bold;
                margin: 0px 10px 0px 0px;
            }

            .yearText{
                font-size:24px;
                margin:0;
            }

            .headerDays{
                display:grid;
                grid-template-columns:repeat(7,1fr);
                grid-gap:10px;
                color:#3F4254;
            }

            .dayHeader{
                color: #3F4254;
                font-size:16px;
                margin:0;
                font-weight:bold;
                text-align:center;
            }

            .gridMonth{
                display:grid;
                grid-template-columns:repeat(7,1fr);
                grid-gap:10px;
            }

            .monthGridItem{
                width:25px;
                height:25px;
                border-radius:100%;
                display:flex;
                justify-content:center;
                align-items:center;
                font-size:16px;
                color:#181C32;
                margin:0;
                text-align:center;
            }

            #todayItem{
                width:25px;
                height:25px;
                background-color:#E75B0B;
                border-radius:100%;
            }

            .monthGridItem:hover{
                cursor:pointer;
                background-color:rgb(225 235 247);

            }
        `;

        for(let i = 0; i < 8; i++){
            const headerDayItem = document.createElement("span");
            headerDayItem.setAttribute("class", "dayHeader");
            headerDayItem.textContent = this.getDayName(i, true);
            headerDays.appendChild(headerDayItem);
        }

        this._currentDate.monthDays.forEach((date)=>{
            const monthGridItem = document.createElement("p");
            monthGridItem.setAttribute("class", "monthGridItem");
            if(date.isToday){
                monthGridItem.setAttribute("id","todayItem");
            }
            monthGridItem.setAttribute("data-date", date.date);
            monthGridItem.addEventListener("click", (e) => this.clickDate(e));
            monthGridItem.textContent = date.day;
            gridMonth.appendChild(monthGridItem);
        });

        
        monthYear.appendChild(monthText);
        monthYear.appendChild(yearText);
        divCalendar.appendChild(monthYear);
        divCalendar.appendChild(headerDays);
        divCalendar.appendChild(gridMonth);
        divCalendar.appendChild(style);
       
        this.getAppointmentData();
    }

    clickDate(e){
        const date = e.target.dataset.date;
        if(date){
            this.currentDate = this.getCurrentDate(date);
        }
    }

    getAppointmentData(){

        /* fetch(`https://api.staging.medizona.com.mx/api/v3/appointments/events?date_from=${this.currentDate.formatted}&date_to=${this.currentDate.formatted}`,{ */
        fetch(`https://api.staging.medizona.com.mx/api/v3/appointments/events?date_from=${this._currentDate.formatted}&date_to=${this._currentDate.formatted}`,{
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
                 "Authorization": `Bearer 3732|blbGkzDM0B1xiwt4dgOJhwloIFPrGNGFm1OekH4p52e33eb7`,
            },
        })
        .then((response)=>{
            response.json().then((data)=>{
                console.log("DATA:", data.data);

                const filteredByAppointment = data.data.filter((item) => item.calendar === 'appointment');
                this.appointmentList = filteredByAppointment.slice(-3);


              

                //const parentRight = this.shadow.getElementById("listAppointments");

                /* if(parentRight.hasChildNodes()){
                    while(parentRight.firstChild){
                        parentRight.removeChild(parentRight.firstChild);
                    }
                    this.printData({},this.appointmentList); 
                }else{
                    this.printData({},this.appointmentList); 
                } */
                

                
            })
        })

        .catch((error)=>console.log("ERROR:", error));

        
    }

    printAppointmentList(){
        const parentRight = this.shadow.getElementById("listAppointments");
        if(this._appointmentList?.length){
            this._appointmentList.forEach((item)=>{
                parentRight.appendChild(this.createItemList(item)); 
            });
        }else{
            const noAppointmentsText = document.createElement("p");
            noAppointmentsText.textContent = "Sin citas recientes";
            parentRight.appendChild(noAppointmentsText);
        }
    }
    
    printCurrentAppointment(){
        const parentLeft =  this.shadow.getElementById("todayAppointment");

        //DIV DATEEEE
        const divDate = document.createElement("div");
        const dayName = document.createElement("p");
        const dayNumber = document.createElement("p");

        divDate.setAttribute("class","todayDateDiv");
        dayName.setAttribute("class", "dayName");
        dayNumber.setAttribute("class", "dayNumber");
        

        dayName.textContent = this._currentDate.name;
        dayNumber.textContent = this._currentDate.number;

        divDate.appendChild(dayName);
        divDate.appendChild(dayNumber);

        //DIV CURRENT APPOINTMENT
        const currentAppointmentItem = document.createElement("div");
        currentAppointmentItem.setAttribute("class", "currentAppointmentItem");


        //CURRENT title
        const divTitle = document.createElement("div");
        divTitle.setAttribute("class", "divTitleCurrent");

        const point = document.createElement("div");
        point.setAttribute("class", "divPoint");

        const appointmentCurrentTitle = document.createElement("p");
        appointmentCurrentTitle.textContent = 'Cirugía';
        appointmentCurrentTitle.setAttribute("class", "appointmentCurrentTitle");

        divTitle.appendChild(point);
        divTitle.appendChild(appointmentCurrentTitle);


        //CURRENT description
        const appointmentDescription = document.createElement("p");
        appointmentDescription.textContent = 'Información más detallada de lo que el doctor necesite.';
        appointmentDescription.setAttribute("class", "appointmentDescription");



        //CURRENT details
        const divDetails = document.createElement("div");
        divDetails.setAttribute("class", "appointmentDetails");

        const patientName = document.createElement("p");
        patientName.textContent = 'Camilo Gándara';
        patientName.setAttribute("class", "patientCurrentName");

        const appointmentDate =  document.createElement("p");
        appointmentDate.textContent = '6:30 P.M. - 7:30 P.M.';
        appointmentDate.setAttribute("class","appointmentCurrentDate");

        divDetails.appendChild(patientName);
        divDetails.appendChild(appointmentDate);

        const style = document.createElement("style");
        style.textContent = `
            .todayDateDiv{
                display:flex;
                flex-direction:column;
                width:100%;
                margin:0px 0px 15px 0px;
            }

             .dayName{
                margin:0;   
                color:#D9214E;
                font-size:30px;
                font-weight:bold;
            }

            .dayNumber{
                margin:0;
                color:#3F4254;
                font-size:50px;
            }

            .currentAppointmentItem{
                width:100%;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                border-left:4px solid #E75B0B;
                border-radius: 0px 0px 0px 0px;
                padding:0px 0px 0px 4px;
                margin:0px 0px 10px 0px;
            }

            .divTitleCurrent{
                width:100%;
                display:flex;
                justify-content:flex-start;
                align-items:center;
            }

            .divPoint{
                width:5px;
                height:5px;
                background-color:#E75B0B;
                border-radius:100%;
                margin:0px 3px 0px 0px;
            }

            .appointmentCurrentTitle{
                color:#181C32;
                font-weight:bold;
                font-size:16px;
                margin:0;
            }

            .patientCurrentName{
                margin:0;
                font-size:14px;
            }

            .appointmentCurrentDate{
                margin:0;
                font-size:14px;
                color:#181C32;
            }

            .appointmentDescription{
                width:
                font-size:14px;
                margin:0px 0px 10px 0px;
                color:#7E8299;
            }
        `;
        
        currentAppointmentItem.appendChild(divTitle);
        currentAppointmentItem.appendChild(appointmentDescription);
        currentAppointmentItem.appendChild(divDetails);

        parentLeft.appendChild(divDate);
        parentLeft.appendChild(currentAppointmentItem);
        parentLeft.appendChild(style);

    }

    createItemList(data){
        const appointmentItem = document.createElement("div");
        appointmentItem.setAttribute("class", "appointmentItem");

        const divTitle = document.createElement("div");
        divTitle.setAttribute("class", "divTitle");

        const appointmentTitle = document.createElement("p");
        //appointmentTitle.textContent = 'Consulta';
        appointmentTitle.textContent = data.title;
        appointmentTitle.setAttribute("class", "appointmentTitle");


        const appointmentDetails = document.createElement("div");
        appointmentDetails.setAttribute("class", "appointmentDetails");

        /* const patientName = document.createElement("p");
        patientName.textContent = data?.title;
        patientName.setAttribute("class", "patientName"); */

        const appointmentDate =  document.createElement("p");
        /* appointmentDate.textContent = '6:30 P.M. - 7:30 P.M.'; */
        appointmentDate.textContent = `${this.formatToAmPm(data.start)} - ${this.formatToAmPm(data.end)}`;
        appointmentDate.setAttribute("class","appointmentDate");


        divTitle.appendChild(appointmentTitle);
        appointmentItem.appendChild(divTitle);
        //appointmentDetails.appendChild(patientName);
        appointmentDetails.appendChild(appointmentDate);

        const style =  document.createElement("style");

        style.textContent = `
            .appointmentItem{
                width:100%;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                border-left:4px solid #34367F;
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
                
            .appointmentTitle{
                color:#181C32;
                font-weight:bold;
                font-size:16px;
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
                text-transform: capitalize;
            }

            .appointmentDate{
                margin:0;
                font-size:14px;
                font-weight:bold;
            }
        `;
        appointmentItem.appendChild(appointmentDetails);
        appointmentDetails.appendChild(style);

        //Retorna el item del appointment
        return appointmentItem;

    };

    

    

    getCurrentDate(date){
        const today = date ? new Date(date + 'T00:00:00') : new Date();
        // Obtener los componentes de la fecha (año, mes y día)
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 porque los meses empiezan desde 0
        const day = String(today.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos

        const dayNumber = today.getDay();
        // Formatear la fecha como "YYYY-MM-DD"
        const formattedDate = `${year}-${month}-${day}`;

        return {
            name:this.getDayName(dayNumber),
            number:day,
            formatted:formattedDate,
            monthName:this.getMonthName(month),
            year:year,
            monthDays:this.getMonthDays(formattedDate),
        };
    }

    getMonthDays(dateString){
        const date = new Date(dateString);
        const columns = [];
        const dayStart =   new Date(date.getFullYear(), date.getMonth(), 1);
        const dayEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

       

        if (dayStart.getDay() !== 0) {
            const offset = dayStart.getDay();
            dayStart.setDate(dayStart.getDate() - offset);
           
        }

        if (dayEnd.getDay() !== 6) {
            const offset = 6 - dayEnd.getDay();
            dayEnd.setDate(dayEnd.getDate() + offset);
        }

        while (dayStart < dayEnd) {
            const dateKey = dayStart.toISOString().split("T")[0]; // Formato YYYY-MM-DD

            columns.push({
                date: dateKey,
                day: dayStart.getDate().toString(),
                today: new Date(),
                isToday: new Date().toDateString() === dayStart.toDateString(),
            });

            dayStart.setDate(dayStart.getDate() + 1);
        }

        return columns;
    }

     formatToAmPm(dateRange) {
        // Dividir la cadena en fecha de inicio y fin (solo necesitamos la primera)
        const [startDate] = dateRange.split(" - ");
        
        // Crear un objeto Date a partir de la cadena
        const date = new Date(startDate);
        
        // Obtener horas y minutos
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        
        // Determinar si es A.M. o P.M.
        const ampm = hours >= 12 ? "P.M." : "A.M.";
        
        // Convertir a formato de 12 horas
        hours = hours % 12 || 12; // Si es 0 horas, ajustarlo a 12
    
        // Formatear los minutos en dos dígitos
        const formattedMinutes = minutes.toString().padStart(2, "0");
    
        // Retornar la hora formateada
        return `${hours}:${formattedMinutes} ${ampm}`;
    }

    getMonthName(monthNumber){

        switch(monthNumber){
            case "1":
                return "Enero"
            case "2":
                return "Febrero"
            case "3":
                return "Marzo"
            case "4":
                return "Abril"
            case "5":
                return "Mayo"
            case "6":
                return "Junio"
            case "7":
                return "Julio"
            case "8":
                return "Agosto"
            case "9":
                return "Septiembre"
            case "10":
                return "Octubre"
            case "11":
                return "Noviembre"
            case "12":
                return "Diciembre"
            
        }
    }

    getDayName(number, firstLetter){

        switch(number){
            case 0:
                return firstLetter ? "D" : "Domingo"
            case 1:
                return firstLetter ? "L" : "Lunes"
            case 2:
                return firstLetter ? "M" : "Martes"
            case 3:
                return firstLetter ? "M" : "Miércoles"
            case 4:
                return firstLetter ? "J" : "Jueves"
            case 5:
                return firstLetter ? "V" : "Viernes"
            case 6:
                return firstLetter ? "S" : "Sábado"
            
        }

    }
}

customElements.define("agenda-widget", AgendaMedizonaWidget);