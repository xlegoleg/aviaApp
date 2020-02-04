class TicketsUI {
  constructor() {
    this.container = document.querySelector('.tickets-section .row');
  }

  renderTickets(tickets) {
    this.clearContainer();

    if (!tickets.length) {
      console.log(tickets.length);
      this.showEmptyMessage();
      return;
    }
    
    let fragment = '';

    tickets.forEach((ticket) => {
      let template = TicketsUI.ticketTemplate(ticket);
      fragment += template;
    });

    this.container.insertAdjacentHTML('afterbegin',fragment);
  }

  clearContainer(){
    this.container.innerHTML = '';
  }

  showEmptyMessage(){
    const template = TicketsUI.emptyMessageTemlate();
    this.container.insertAdjacentHTML('afterbegin',template);
    const element = document.querySelector('.empty-msg');
    element.classList.add('empty-msg_active');
    setTimeout(() => {
      element.classList.remove('empty-msg_active');
    },3000);
  }

  static ticketTemplate(ticket) {
    return `
    <div class="col l6">
    <div class="card">
      <div class="card-content">
        <div class="ticket-title d-flex ai-center">
          <div class="ticket-airline">
            <img src="${ticket.airline_logo}" alt="airline-logo">
            <div class="ticket-airline__name">${ticket.airline_name}</div>
          </div>
          <div class="ticket-price ml-auto">${ticket.currency} ${ticket.price}</div>
        </div>
        <div class="ticket-description d-flex">
          <div class="ticket-origin">
            ${ticket.origin_name}
            <i class="material-icons prefix">flight_takeoff</i>
          </div>
          <div class="ticket-destination ml-auto">
            ${ticket.destination_name}
            <i class="material-icons prefix">flight_land</i>
          </div>
        </div>
      </div>
      <div class="card-action ticket-info d-flex">
        <div class="ticket-depret d-flex fd-column">
          <div class="ticket-depret__time">${ticket.departure_time}</div>
          <div class="ticket-depret__code">${ticket.origin}</div>
          <div class="ticket-depret__date">${ticket.departure_at}</div>
        </div>
        <div class="ticket-depret ml-auto d-flex fd-column">
          <div class="ticket-depret__time ml-auto">${ticket.return_time}</div>
          <div class="ticket-depret__code ml-auto">${ticket.destination}</div>
          <div class="ticket-depret__date">${ticket.return_at}</div>
        </div>
        <div class="ticket-transfers">
          Пересадок: ${ticket.transfers} Номер рейса: ${ticket.flight_number}
        </div>
      </div>
    </div>
  </div>
    `;
  }

  static emptyMessageTemlate() {
    return `
    <div class="empty-msg">
    По Вашему запросу билетов не найдено
    </div>
    `
  }

}


const ticketsUI = new TicketsUI();

export default ticketsUI;