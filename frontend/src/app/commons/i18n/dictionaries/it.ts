import {Dictionary} from '@app/commons/i18n/i18n-types';

/** Italian copy. Typed as Dictionary, so a missing or extra key fails the build. */
export const it: Dictionary = {
  common: {
    appName: 'Health Bridge Clinic',
    save: 'Salva',
    cancel: 'Annulla',
    close: 'Chiudi',
    delete: 'Elimina',
    edit: 'Modifica',
    retry: 'Riprova',
    loading: 'Caricamento…',
    optional: 'facoltativo',
    none: '—',
    skipToContent: 'Vai al contenuto',
    logout: 'Esci',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    home: 'HealthBridge Clinic, home',
    doctorName: 'Dr. {name}',
    today: 'Oggi, {time}',
    yesterday: 'Ieri, {time}'
  },
  language: {
    label: 'Lingua',
    en: 'English',
    it: 'Italiano'
  },
  roles: {
    DOCTOR: 'Medico',
    PATIENT: 'Paziente'
  },
  nav: {
    main: 'Principale',
    reports: 'Referti',
    statistics: 'Statistiche'
  },
  status: {
    CREATED: 'Creato',
    IN_PROGRESS: 'In lavorazione',
    FINALIZED: 'Finalizzato'
  },
  patientStatus: {
    CREATED: 'Aperto',
    IN_PROGRESS: 'In lavorazione',
    FINALIZED: 'Pronto'
  },
  flags: {
    LOW: 'Basso',
    HIGH: 'Alto',
    BORDERLINE: 'Al limite',
    NORMAL: 'Nella norma',
    NONE: 'Senza riferimento'
  },
  errors: {
    VALIDATION_FAILED: 'Alcuni campi non sono validi. Controllali e riprova.',
    MALFORMED_REQUEST: 'Non è stato possibile elaborare la richiesta.',
    NOT_FOUND: 'La pagina o la risorsa non è stata trovata.',
    INVALID_CREDENTIALS: 'Email o password non corrette. Controllale e riprova.',
    UNAUTHENTICATED: 'La sessione è scaduta. Accedi di nuovo.',
    ACCESS_DENIED: 'Non hai i permessi per questa operazione.',
    REPORT_NOT_FOUND: 'Questo referto non esiste o non è disponibile per te.',
    EXAM_NOT_FOUND: 'Questo esame non esiste più.',
    PATIENT_NOT_FOUND: 'Il paziente selezionato non è stato trovato.',
    PATIENT_REQUIRED: 'Seleziona un paziente per il referto.',
    REPORT_NOT_EDITABLE: 'Questo referto è finalizzato e non può più essere modificato.',
    REPORT_MISSING_EXAMS: 'Aggiungi almeno un esame prima di finalizzare.',
    REPORT_MISSING_OUTCOME: 'Scrivi l’esito prima di finalizzare.',
    INTERNAL_ERROR: 'Si è verificato un errore sul server. Riprova.',
    NETWORK: 'Il server non è raggiungibile. Controlla la connessione e riprova.',
    UNKNOWN: 'Qualcosa è andato storto. Riprova.'
  },
  validation: {
    required: 'Campo obbligatorio.',
    email: 'Inserisci un indirizzo email valido.',
    number: 'Inserisci un numero.',
    rangeOrder: 'Il minimo non può essere maggiore del massimo.',
    maxLength: 'Usa al massimo {max} caratteri.'
  },
  toast: {
    dismiss: 'Chiudi notifica'
  },
  auth: {
    brand: {
      headline: 'Il ponte digitale tra medico e paziente.',
      lead: 'Referti ed esami in un unico posto: il medico li redige, il paziente li consulta appena sono pronti.',
      feature1Title: 'Referti in tempo reale',
      feature1Text: 'Nessun ritiro allo sportello, nessuna email manuale.',
      feature2Title: 'Dati clinici protetti',
      feature2Text: 'Accesso per ruolo, referti finalizzati non modificabili.',
      feature3Title: 'Semplice per tutti',
      feature3Text: 'Interfaccia chiara, conforme alle linee guida WCAG 2.1 AA.',
      footer: '© 2026 Health Bridge Clinic · Project Work L-31'
    },
    login: {
      title: 'Accedi',
      subtitle: 'Usa le credenziali fornite dalla clinica. Verrai portato alla tua area in base al ruolo.',
      email: 'Email',
      password: 'Password',
      forgot: 'Password dimenticata?',
      forgotInfo: 'Per reimpostare la password contatta la segreteria della clinica.',
      showPassword: 'Mostra password',
      hidePassword: 'Nascondi password',
      remember: 'Ricordami su questo dispositivo',
      submit: 'Accedi',
      submitting: 'Accesso in corso…',
      help: 'Problemi di accesso? Contatta la segreteria della clinica: ti aiuterà a recuperare le credenziali.'
    },
    demo: {
      title: 'Account demo',
      hint: 'Solo nella build demo. Questi account vengono creati all’avvio del backend su un database vuoto.',
      use: 'Compila',
      useAria: 'Compila le credenziali di {name}'
    },
    unauthorized: {
      title: 'Accesso negato',
      text: 'Non hai i permessi necessari per visualizzare questa pagina.',
      back: 'Torna ai miei referti'
    }
  },
  reports: {
    list: {
      greetingMorning: 'Buongiorno, {name}',
      greetingAfternoon: 'Buon pomeriggio, {name}',
      greetingEvening: 'Buonasera, {name}',
      title: 'Referti',
      newReport: 'Nuovo referto',
      newShort: 'Nuovo',
      summary: 'Riepilogo',
      kpiToComplete: 'Da completare',
      kpiToCompleteDetail: '{created} creati · {progress} in lavorazione',
      kpiFinalizedWeek: 'Finalizzati questa settimana',
      kpiFinalizedWeekDetail: 'consegnati ai pazienti',
      kpiOutOfRange: 'Valori fuori range',
      kpiOutOfRangeShort: 'Fuori range',
      kpiOutOfRangeDetail: {one: 'in {count} referto da rivedere', other: 'in {count} referti da rivedere'},
      filterLabel: 'Filtra per stato',
      all: 'Tutti',
      filters: {
        CREATED: 'Creati',
        IN_PROGRESS: 'In lavorazione',
        FINALIZED: 'Finalizzati'
      },
      searchLabel: 'Cerca referti',
      searchPlaceholder: 'Cerca paziente o n° referto',
      sortLabel: 'Ordina per',
      sortNewest: 'Più recenti',
      sortOldest: 'Meno recenti',
      sortPatient: 'Nome paziente',
      colNumber: 'N°',
      colPatient: 'Paziente',
      colStatus: 'Stato',
      colExams: 'Esami',
      colUpdated: 'Ultima modifica',
      colActions: 'Azioni',
      open: 'Apri referto #{id}',
      exams: {one: '{count} esame', other: '{count} esami'},
      outOfRange: '{count} fuori range',
      total: {one: '{count} referto', other: '{count} referti'},
      emptyTitle: 'Nessun referto',
      emptyText: 'Crea il primo referto per uno dei tuoi pazienti.',
      noResultsTitle: 'Nessun referto trovato',
      noResultsText: 'Prova un altro nome o numero di referto, oppure azzera i filtri.',
      clearFilters: 'Azzera filtri',
      loadError: 'Non è stato possibile caricare i referti.'
    },
    create: {
      title: 'Nuovo referto',
      patient: 'Paziente',
      patientPlaceholder: 'Seleziona un paziente',
      hint: 'Il referto si apre subito nell’editor, così puoi aggiungere gli esami.',
      submit: 'Crea referto',
      created: 'Referto #{id} creato'
    },
    editor: {
      breadcrumb: 'Percorso',
      title: 'Referto',
      unsaved: 'Modifiche non salvate',
      saved: 'Tutte le modifiche salvate',
      finalize: 'Finalizza referto',
      readOnly: 'Questo referto è finalizzato e non può più essere modificato.',
      notFoundTitle: 'Referto non trovato',
      backToList: 'Torna ai referti'
    },
    stepper: {
      label: 'Stato del referto',
      created: 'Creato',
      progress: 'In lavorazione',
      progressDetail: {one: '{count} esame inserito', other: '{count} esami inseriti'},
      progressWaiting: 'in attesa del primo esame',
      final: 'Finalizzato',
      finalPending: 'poi non più modificabile',
      done: 'completato',
      current: 'passaggio attuale'
    },
    exams: {
      title: 'Esami',
      summaryOut: {one: '{count} valore fuori dall’intervallo di riferimento', other: '{count} valori fuori dall’intervallo di riferimento'},
      summaryOk: 'Tutti i valori nell’intervallo di riferimento',
      summaryEmpty: 'Nessun esame inserito',
      add: 'Aggiungi esame',
      colAnalysis: 'Analisi',
      colValue: 'Valore',
      colUnit: 'Unità',
      colReference: 'Riferimento',
      colResult: 'Esito',
      colActions: 'Azioni',
      editAria: 'Modifica {name}',
      deleteAria: 'Elimina {name}',
      emptyText: 'Aggiungi il primo esame per iniziare il referto.',
      saved: 'Esame salvato',
      deleted: 'Esame eliminato',
      deleteTitle: 'Eliminare questo esame?',
      deleteText: '“{name}” verrà rimosso da questo referto.',
      reference: 'Riferimento {range}',
      rangeBar: 'Valore {value} rispetto all’intervallo {range}'
    },
    examForm: {
      titleNew: 'Nuovo esame',
      titleEdit: 'Modifica esame',
      analysis: 'Analisi',
      unit: 'Unità di misura',
      value: 'Valore',
      reference: 'Intervallo di riferimento',
      refMin: 'Minimo',
      refMax: 'Massimo',
      refHint: 'Lascia vuoto un estremo per intervalli aperti, ad esempio “< 200”.'
    },
    outcome: {
      label: 'Esito',
      requiredHint: 'Obbligatorio per finalizzare',
      placeholder: 'Scrivi la valutazione clinica in un linguaggio comprensibile per il paziente…',
      help: 'Il paziente vedrà questo testo nella sua area personale.',
      counter: '{count} / {max}',
      save: 'Salva esito',
      saved: 'Esito salvato'
    },
    checklist: {
      title: 'Pronto per la finalizzazione?',
      patient: 'Paziente associato',
      exams: 'Almeno un esame con valore',
      outcome: 'Esito compilato',
      done: 'fatto',
      missing: 'mancante',
      note: 'Dopo la finalizzazione il referto non potrà più essere modificato e il paziente riceverà una notifica.',
      blocked: 'Per finalizzare manca: {items}.',
      unsaved: 'Salva l’esito prima di finalizzare.'
    },
    patientCard: {
      title: 'Paziente',
      history: 'Storico referti del paziente',
      historyCount: 'Storico referti del paziente ({count})'
    },
    details: {
      title: 'Dettagli',
      createdBy: 'Creato da',
      createdAt: 'Creato il',
      updatedAt: 'Ultima modifica',
      finalizedAt: 'Finalizzato il'
    },
    timeline: {
      title: 'Cronologia',
      created: 'Referto creato',
      examAdded: 'Esame aggiunto: {name}',
      finalized: 'Referto finalizzato'
    },
    finalizeDialog: {
      title: 'Finalizzare il referto #{id}?',
      text: 'Un referto finalizzato diventa di sola lettura: esami ed esito non potranno più essere modificati. Il paziente potrà consultarlo e riceverà una notifica.',
      confirm: 'Finalizza',
      done: 'Referto #{id} finalizzato'
    }
  },
  patient: {
    home: {
      greeting: 'Ciao {name}',
      lead: 'Qui trovi i tuoi referti appena il medico li rende disponibili.',
      readyTitle: 'Il referto #{id} è pronto',
      readyDetail: 'Finalizzato da {doctor} il {date}',
      openReport: 'Apri referto',
      listTitle: 'I miei referti',
      count: {one: '{count} referto', other: '{count} referti'},
      cardTitle: 'Referto #{id}',
      metaFinal: '{exams} · {doctor} · {date}',
      metaOpen: '{doctor} · aperto il {date}',
      allInRange: 'Tutti i valori nella norma',
      toDiscuss: {one: '{count} valore da discutere con il medico', other: '{count} valori da discutere con il medico'},
      pendingText: 'Il medico sta completando la valutazione. Ti avviseremo quando sarà pronto.',
      download: 'Scarica PDF',
      open: 'Apri',
      viewStatus: 'Vedi stato',
      openAria: 'Apri referto #{id}',
      emptyTitle: 'Nessun referto',
      emptyText: 'I tuoi referti compariranno qui dopo la visita.',
      loadError: 'Non è stato possibile caricare i tuoi referti.'
    },
    how: {
      title: 'Come funziona un referto',
      step1Title: 'Creato',
      step1Text: 'Il medico apre il referto dopo il tuo prelievo o la tua visita.',
      step2Title: 'In lavorazione',
      step2Text: 'Vengono inseriti i risultati degli esami.',
      step3Title: 'Pronto',
      step3Text: 'Puoi leggerlo e scaricarlo. Non verrà più modificato.'
    },
    help: {
      title: 'Hai domande su un referto?',
      text: 'Prenota un colloquio con il tuo medico o contatta la segreteria.',
      contact: 'Contatta la segreteria',
      book: 'Prenota un colloquio'
    },
    report: {
      back: 'Torna ai miei referti',
      title: 'Referto #{id}',
      summaryOk: 'Tutti i valori nella norma',
      summaryOut: {one: '{count} valore da discutere con il medico', other: '{count} valori da discutere con il medico'},
      byline: '{doctor} · {date}',
      outcomeTitle: 'Esito del medico',
      examsTitle: 'Esami ({count})',
      noReference: 'Nessun intervallo di riferimento',
      question: 'Hai dubbi su un valore?',
      book: 'Prenota un colloquio',
      questionTail: 'con il tuo medico.',
      download: 'Scarica PDF',
      notReadyTitle: 'Il tuo referto non è ancora pronto',
      notReadyText: 'Risultati ed esito saranno visibili quando il medico avrà finalizzato il referto.',
      printTitle: 'Referto medico #{id}',
      printPatient: 'Paziente',
      printDoctor: 'Medico',
      printFinalized: 'Finalizzato il',
      printFooter: 'Stampato il {date} da Health Bridge Clinic.'
    }
  },
  analytics: {
    title: 'Statistiche',
    subtitle: 'Andamento dell’attività della clinica',
    indicators: 'Indicatori',
    totalReports: 'Referti totali',
    totalDetail: '{created} creati, {progress} in lavorazione, {final} finalizzati',
    avgTime: 'Tempo medio di refertazione',
    days: {one: 'giorno', other: 'giorni'},
    hours: {one: 'ora', other: 'ore'},
    avgDetail: 'dalla creazione alla finalizzazione',
    avgNone: 'Nessun referto ancora finalizzato',
    users: 'Utenti',
    usersDetail: '{doctors} medici · {patients} pazienti',
    exams: 'Esami registrati',
    examsDetail: {one: '{count} fuori dall’intervallo di riferimento', other: '{count} fuori dall’intervallo di riferimento'},
    weeklyTitle: 'Referti creati per settimana',
    weeklySubtitle: 'Ultime 6 settimane',
    weeklyAria: 'Referti creati per settimana: {values}',
    weekOf: 'Settimana del {date}: {count}',
    statusTitle: 'Referti per stato',
    statusSubtitle: 'Dove si trova ogni referto nel suo ciclo di vita',
    statusAria: '{created} creati, {progress} in lavorazione, {final} finalizzati',
    legendCreated: 'Creati, in attesa del primo esame',
    legendProgress: 'In lavorazione',
    legendFinal: 'Finalizzati, visibili ai pazienti',
    staleNote: {
      one: '{count} referto è fermo in stato “Creato” da più di 2 giorni.',
      other: '{count} referti sono fermi in stato “Creato” da più di 2 giorni.'
    },
    staleLink: 'Vedi elenco',
    splitTitle: 'Medici e pazienti',
    splitSubtitle: 'Account registrati',
    doctors: 'Medici',
    patients: 'Pazienti',
    loadError: 'Non è stato possibile caricare le statistiche.'
  }
};
