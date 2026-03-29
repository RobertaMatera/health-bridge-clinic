# rm-project-work-16
Applicazione full-stack API-based per la gestione di dati sanitari, composta da backend Spring Boot e frontend Angular.

## Panoramica
Il progetto è pensato per digitalizzare e semplificare la gestione di referti, esami e utenti in ambito sanitario, garantendo sicurezza, accessibilità e una user experience moderna.

## Struttura del progetto
- **backend/**: Applicazione Spring Boot (Java + Maven) che espone API REST per la gestione di utenti, esami, referti, autenticazione e statistiche.
- **frontend/**: Applicazione Angular (Standalone Components) che consuma le API e offre un'interfaccia utente responsive e accessibile.

## Tecnologie principali
- **Backend**: Java 25, Spring Boot, Spring Data JPA, Spring Security, Lombok, MapStruct, H2 Database, OpenAPI
- **Frontend**: Angular 21, RxJS, TailwindCSS, FontAwesome, ng2-charts, TypeScript

## Prerequisiti
- Java 25
- Maven
- Node.js (versione LTS consigliata)
- npm o pnpm

## Installazione e avvio
### Backend
1. Posizionarsi nella cartella `backend`:
   ```bash
   cd backend
   ```
2. Avviare il backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   Il backend sarà disponibile su `http://localhost:8080`.

3. Per cancellare il database H2 (sviluppo):
   ```bash
   rm projectworkmrdb.mv.db projectworkmrdb.trace.db
   ```

### Frontend
1. Posizionarsi nella cartella `frontend`:
   ```bash
   cd frontend
   ```
2. Installare le dipendenze:
   ```bash
   npm install
   ```
3. Avviare il frontend:
   ```bash
   npm start
   ```
   L'app sarà disponibile su `http://localhost:4200`.


## Database
- Database H2 in modalità file system, ricreato automaticamente all’avvio del backend.
- Console H2 disponibile su `/h2-console` (solo in sviluppo).

## Accessibilità e Design
- L’interfaccia segue le linee guida WCAG 2.1 AA per garantire contrasto, leggibilità e navigazione da tastiera.
- Scelte cromatiche e tipografiche motivate da principi di psicologia dei colori e design della user experience (vedi commenti nei file di stile).
- Layout responsive, con componenti e pulsanti facilmente accessibili anche su dispositivi mobili.

## Riferimenti e documentazione
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Angular](https://angular.dev/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [OpenAPI](https://swagger.io/specification/)

## Autore
Roberta Matera
