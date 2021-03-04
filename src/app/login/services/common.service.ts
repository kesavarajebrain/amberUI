import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private BaseUrl = "http://localhost:5000/api/";
  constructor(private http: HttpClient) { }

  addUser(data){
    return this.http.post<any>(this.BaseUrl + 'addUser', data);
  }

  loginUser(data){
    return this.http.post<any>(this.BaseUrl + 'logUser', data);
  }

  searchTrain(data){
    return this.http.post<any>(this.BaseUrl + 'searchTrains', data);
  }

  bookTrain(data){
    return this.http.post<any>(this.BaseUrl + 'bookTrain', data);
  }

  updateSeat(data){
    return this.http.post<any>(this.BaseUrl + 'updateSeat', data);
  }

  bookingHistory(data){
    return this.http.post<any>(this.BaseUrl + 'bookingSummary', data);
  }

  cancelTicket(data){
    return this.http.post<any>(this.BaseUrl + 'cancelTicket', data);
  }

  getSeat(data){
    return this.http.post<any>(this.BaseUrl + 'getSeats', data);
  }

}
