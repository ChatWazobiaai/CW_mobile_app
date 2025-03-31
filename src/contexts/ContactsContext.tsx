import React, { createContext, useState, useContext, ReactNode } from 'react';

type Contact = {
  contactName: string;
  phoneNumber: string;
  recordID: string;
};

type ContactsContextType = {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
};

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = (): ContactsContextType => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};

export { ContactsContext };