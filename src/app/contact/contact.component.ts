import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams: string = '';
  constructor(private http: HttpClient) { }


 async ngOnInit() {
  this.loadContacts();
 }

 async loadContacts(){
  const savedContacts = this.getItemsFromLocalStorage('contacts');
  if(savedContacts && savedContacts.length > 0) {
    this.contacts = savedContacts;
  } else {
  this.contacts = await this.loadItemsFromFile();
}
 }

  async loadItemsFromFile(){
    const data: any = await this.http.get('assets/contacts.json').toPromise();
    console.log('from LoadItemsFromFile data: ' , data);
    return data;
  }

  addContact(){
    this.contacts.unshift(new Contact({}));
    console.log('this.contacts...', this.contacts);
  }

  deleteContact(index: number){
    console.log('from deleteContact index: ', index);
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveContact(contact: any){
    console.log('from saveContact', contact);
    contact.editing = false;

  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    return savedContacts;
  }

  searchContact(params: string) {
    console.log('from searchContact params: ', params);
    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      console.log('full name is --->', fullName);
      console.log('items--->', item.firstName);
      if(params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact:Contact, presContact: Contact) => {
  
      return prevContact.id > presContact.id ? 1 : -1;
    });
    return contacts;
  }
}
