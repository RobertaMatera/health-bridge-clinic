/**
 * English copy. This dictionary defines the shape every other language must match.
 * Placeholders use {name}; plural entries are { one, other } objects selected by {count}.
 */
export const en = {
  common: {
    appName: 'Health Bridge Clinic',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    retry: 'Try again',
    loading: 'Loading…',
    optional: 'optional',
    none: '—',
    skipToContent: 'Skip to content',
    logout: 'Log out',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'HealthBridge Clinic, home',
    doctorName: 'Dr. {name}',
    today: 'Today, {time}',
    yesterday: 'Yesterday, {time}'
  },
  language: {
    label: 'Language',
    en: 'English',
    it: 'Italiano'
  },
  roles: {
    DOCTOR: 'Doctor',
    PATIENT: 'Patient'
  },
  nav: {
    main: 'Main',
    reports: 'Reports',
    statistics: 'Statistics'
  },
  status: {
    CREATED: 'Created',
    IN_PROGRESS: 'In progress',
    FINALIZED: 'Finalized'
  },
  patientStatus: {
    CREATED: 'Opened',
    IN_PROGRESS: 'In progress',
    FINALIZED: 'Ready'
  },
  flags: {
    LOW: 'Low',
    HIGH: 'High',
    BORDERLINE: 'Borderline',
    NORMAL: 'Normal',
    NONE: 'No range'
  },
  errors: {
    VALIDATION_FAILED: 'Some fields are not valid. Check them and try again.',
    MALFORMED_REQUEST: 'The request could not be processed.',
    NOT_FOUND: 'The page or resource was not found.',
    INVALID_CREDENTIALS: 'Email or password is incorrect. Check them and try again.',
    UNAUTHENTICATED: 'Your session has expired. Please sign in again.',
    ACCESS_DENIED: 'You do not have permission to do this.',
    REPORT_NOT_FOUND: 'This report does not exist or is not available to you.',
    EXAM_NOT_FOUND: 'This exam no longer exists.',
    PATIENT_NOT_FOUND: 'The selected patient could not be found.',
    PATIENT_REQUIRED: 'Select a patient for the report.',
    REPORT_NOT_EDITABLE: 'This report is finalized and can no longer be edited.',
    REPORT_MISSING_EXAMS: 'Add at least one exam before finalizing.',
    REPORT_MISSING_OUTCOME: 'Write the outcome before finalizing.',
    INTERNAL_ERROR: 'Something went wrong on our side. Please try again.',
    NETWORK: 'The server cannot be reached. Check your connection and try again.',
    UNKNOWN: 'Something went wrong. Please try again.'
  },
  validation: {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    number: 'Enter a number.',
    rangeOrder: 'The minimum must not be greater than the maximum.',
    maxLength: 'Use at most {max} characters.'
  },
  toast: {
    dismiss: 'Dismiss notification'
  },
  statusPages: {
    home: 'Back to my reports',
    login: 'Go to sign in',
    notFound: {
      title: 'Page not found',
      text: 'The address may be mistyped, or the page may have been moved or removed.'
    },
    error: {
      title: 'Something went wrong',
      text: 'This page could not be loaded. Check your connection and try again. If the problem continues, contact the clinic office.',
      retry: 'Try again'
    }
  },
  auth: {
    brand: {
      headline: 'The digital bridge between doctor and patient.',
      lead: 'Reports and exams in one place: the doctor writes them, the patient reads them as soon as they are ready.',
      feature1Title: 'Reports in real time',
      feature1Text: 'No pick-up at the front desk, no manual emails.',
      feature2Title: 'Protected clinical data',
      feature2Text: 'Role-based access; finalized reports cannot be changed.',
      feature3Title: 'Simple for everyone',
      feature3Text: 'A clear interface that follows WCAG 2.1 AA.',
      footer: '© 2026 Health Bridge Clinic · Project Work L-31'
    },
    login: {
      title: 'Sign in',
      subtitle: 'Use the credentials provided by the clinic. You will be taken to your area based on your role.',
      email: 'Email',
      password: 'Password',
      forgot: 'Forgot password?',
      forgotInfo: 'To reset your password, contact the clinic office.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      remember: 'Remember me on this device',
      submit: 'Sign in',
      submitting: 'Signing in…',
      help: 'Trouble signing in? Contact the clinic office: they will help you recover your credentials.'
    },
    demo: {
      title: 'Demo accounts',
      hint: 'Demo build only. These accounts are created when the backend starts on an empty database.',
      use: 'Fill in',
      useAria: 'Fill in the credentials of {name}',
      mockHint: 'Fictional people with password “demo”. Each one sees different reports.',
      quickTitle: 'Try the demo',
      quickText: 'No setup needed: pick a role and sign in with one click.',
      asDoctor: 'Log in as Doctor',
      asPatient: 'Log in as Patient'
    },
    unauthorized: {
      title: 'Access denied',
      text: 'You do not have permission to view this page.',
      back: 'Back to my reports'
    }
  },
  reports: {
    list: {
      greetingMorning: 'Good morning, {name}',
      greetingAfternoon: 'Good afternoon, {name}',
      greetingEvening: 'Good evening, {name}',
      title: 'Reports',
      newReport: 'New report',
      newShort: 'New',
      summary: 'Summary',
      kpiToComplete: 'To complete',
      kpiToCompleteDetail: '{created} created · {progress} in progress',
      kpiFinalizedWeek: 'Finalized this week',
      kpiFinalizedWeekDetail: 'delivered to patients',
      kpiOutOfRange: 'Out-of-range values',
      kpiOutOfRangeShort: 'Out of range',
      kpiOutOfRangeDetail: {one: 'in {count} report to review', other: 'in {count} reports to review'},
      filterLabel: 'Filter by status',
      all: 'All',
      filters: {
        CREATED: 'Created',
        IN_PROGRESS: 'In progress',
        FINALIZED: 'Finalized'
      },
      searchLabel: 'Search reports',
      searchPlaceholder: 'Search patient or report no.',
      sortLabel: 'Sort by',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      sortPatient: 'Patient name',
      colNumber: 'No.',
      colPatient: 'Patient',
      colStatus: 'Status',
      colExams: 'Exams',
      colUpdated: 'Last modified',
      colActions: 'Actions',
      open: 'Open report #{id}',
      exams: {one: '{count} exam', other: '{count} exams'},
      outOfRange: '{count} out of range',
      total: {one: '{count} report', other: '{count} reports'},
      emptyTitle: 'No reports yet',
      emptyText: 'Create the first report for one of your patients.',
      noResultsTitle: 'No matching reports',
      noResultsText: 'Try another name or report number, or clear the filters.',
      clearFilters: 'Clear filters',
      loadError: 'Reports could not be loaded.'
    },
    create: {
      title: 'New report',
      patient: 'Patient',
      patientPlaceholder: 'Select a patient',
      hint: 'The report opens in the editor right away, so you can add exams.',
      submit: 'Create report',
      created: 'Report #{id} created'
    },
    editor: {
      breadcrumb: 'Breadcrumb',
      title: 'Report',
      unsaved: 'Unsaved changes',
      saved: 'All changes saved',
      finalize: 'Finalize report',
      readOnly: 'This report is finalized and can no longer be edited.',
      notFoundTitle: 'Report not found',
      backToList: 'Back to reports'
    },
    stepper: {
      label: 'Report status',
      created: 'Created',
      progress: 'In progress',
      progressDetail: {one: '{count} exam added', other: '{count} exams added'},
      progressWaiting: 'waiting for the first exam',
      final: 'Finalized',
      finalPending: 'no longer editable afterwards',
      done: 'completed',
      current: 'current step'
    },
    exams: {
      title: 'Exams',
      summaryOut: {one: '{count} value outside the reference range', other: '{count} values outside the reference range'},
      summaryOk: 'All values within the reference range',
      summaryEmpty: 'No exams yet',
      add: 'Add exam',
      colAnalysis: 'Analysis',
      colValue: 'Value',
      colUnit: 'Unit',
      colReference: 'Reference',
      colResult: 'Result',
      colActions: 'Actions',
      editAria: 'Edit {name}',
      deleteAria: 'Delete {name}',
      emptyText: 'Add the first exam to start the report.',
      saved: 'Exam saved',
      deleted: 'Exam deleted',
      deleteTitle: 'Delete this exam?',
      deleteText: '“{name}” will be removed from this report.',
      reference: 'Reference {range}',
      rangeBar: 'Value {value} against reference range {range}'
    },
    examForm: {
      titleNew: 'New exam',
      titleEdit: 'Edit exam',
      analysis: 'Analysis',
      unit: 'Unit',
      value: 'Value',
      reference: 'Reference range',
      refMin: 'Minimum',
      refMax: 'Maximum',
      refHint: 'Leave one bound empty for one-sided ranges, e.g. “< 200”.'
    },
    outcome: {
      label: 'Outcome',
      requiredHint: 'Required to finalize',
      placeholder: 'Write the clinical assessment in language the patient can understand…',
      help: 'The patient will see this text in their personal area.',
      counter: '{count} / {max}',
      save: 'Save outcome',
      saved: 'Outcome saved'
    },
    checklist: {
      title: 'Ready to finalize?',
      patient: 'Patient linked',
      exams: 'At least one exam with a value',
      outcome: 'Outcome written',
      done: 'done',
      missing: 'missing',
      note: 'After finalization the report can no longer be edited and the patient will be notified.',
      blocked: 'To finalize, complete: {items}.',
      unsaved: 'Save the outcome before finalizing.'
    },
    patientCard: {
      title: 'Patient',
      history: 'Patient’s report history',
      historyCount: 'Patient’s report history ({count})'
    },
    details: {
      title: 'Details',
      createdBy: 'Created by',
      createdAt: 'Created on',
      updatedAt: 'Last modified',
      finalizedAt: 'Finalized on'
    },
    timeline: {
      title: 'History',
      created: 'Report created',
      examAdded: 'Exam added: {name}',
      finalized: 'Report finalized'
    },
    finalizeDialog: {
      title: 'Finalize report #{id}?',
      text: 'A finalized report becomes read-only: exams and outcome cannot be edited afterwards. The patient will be able to read it and will be notified.',
      confirm: 'Finalize',
      done: 'Report #{id} finalized'
    }
  },
  patient: {
    home: {
      greeting: 'Hello {name}',
      lead: 'Your reports appear here as soon as your doctor makes them available.',
      readyTitle: 'Report #{id} is ready',
      readyDetail: 'Finalized by {doctor} on {date}',
      openReport: 'Open report',
      listTitle: 'My reports',
      count: {one: '{count} report', other: '{count} reports'},
      cardTitle: 'Report #{id}',
      metaFinal: '{exams} · {doctor} · {date}',
      metaOpen: '{doctor} · opened on {date}',
      allInRange: 'All values in range',
      toDiscuss: {one: '{count} value to discuss with your doctor', other: '{count} values to discuss with your doctor'},
      pendingText: 'Your doctor is completing the assessment. We will let you know when it is ready.',
      download: 'Download PDF',
      open: 'Open',
      viewStatus: 'View status',
      openAria: 'Open report #{id}',
      emptyTitle: 'No reports yet',
      emptyText: 'Your reports will appear here after your visit.',
      loadError: 'Your reports could not be loaded.'
    },
    how: {
      title: 'How a report works',
      step1Title: 'Created',
      step1Text: 'Your doctor opens the report after your blood test or visit.',
      step2Title: 'In progress',
      step2Text: 'The results of your exams are added.',
      step3Title: 'Ready',
      step3Text: 'You can read and download it. It will not be changed again.'
    },
    help: {
      title: 'Questions about a report?',
      text: 'Book a consultation with your doctor or contact the clinic office.',
      contact: 'Contact the office',
      book: 'Book a consultation'
    },
    report: {
      back: 'Back to my reports',
      title: 'Report #{id}',
      summaryOk: 'All values in range',
      summaryOut: {one: '{count} value to discuss with your doctor', other: '{count} values to discuss with your doctor'},
      byline: '{doctor} · {date}',
      outcomeTitle: 'Doctor’s outcome',
      examsTitle: 'Exams ({count})',
      noReference: 'No reference range',
      question: 'Questions about a value?',
      book: 'Book a consultation',
      questionTail: 'with your doctor.',
      download: 'Download PDF',
      notReadyTitle: 'Your report is not ready yet',
      notReadyText: 'Results and the outcome will be visible once your doctor finalizes the report.',
      printTitle: 'Medical report #{id}',
      printPatient: 'Patient',
      printDoctor: 'Doctor',
      printFinalized: 'Finalized on',
      printFooter: 'Printed on {date} from Health Bridge Clinic.'
    }
  },
  analytics: {
    title: 'Statistics',
    subtitle: 'Clinic activity at a glance',
    indicators: 'Indicators',
    totalReports: 'Total reports',
    totalDetail: '{created} created, {progress} in progress, {final} finalized',
    avgTime: 'Average time to finalize',
    days: {one: 'day', other: 'days'},
    hours: {one: 'hour', other: 'hours'},
    avgDetail: 'from creation to finalization',
    avgNone: 'No report finalized yet',
    users: 'Users',
    usersDetail: '{doctors} doctors · {patients} patients',
    exams: 'Exams recorded',
    examsDetail: {one: '{count} outside the reference range', other: '{count} outside the reference range'},
    weeklyTitle: 'Reports created per week',
    weeklySubtitle: 'Last 6 weeks',
    weeklyAria: 'Reports created per week: {values}',
    weekOf: 'Week of {date}: {count}',
    statusTitle: 'Reports by status',
    statusSubtitle: 'Where each report is in its lifecycle',
    statusAria: '{created} created, {progress} in progress, {final} finalized',
    legendCreated: 'Created, waiting for the first exam',
    legendProgress: 'In progress',
    legendFinal: 'Finalized, visible to patients',
    staleNote: {
      one: '{count} report has been waiting in “Created” for more than 2 days.',
      other: '{count} reports have been waiting in “Created” for more than 2 days.'
    },
    staleLink: 'View list',
    splitTitle: 'Doctors and patients',
    splitSubtitle: 'Registered accounts',
    doctors: 'Doctors',
    patients: 'Patients',
    loadError: 'Statistics could not be loaded.'
  },
  demo: {
    banner: {
      title: 'Demo mode',
      text: 'fictional data, changes are not saved.',
      dismiss: 'Hide demo notice'
    }
  }
};
