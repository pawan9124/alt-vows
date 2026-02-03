export interface ThemeContent {
    hero: {
      names: string;
      date: string;
      title: string;
      location: string;
    };
    story: {
      title: string;
      description: string;
      image: string;
    };
    logistics: {
      title: string;
      ceremony: {
        time: string;
        venue: string;
        address: string;
      };
      reception: {
        time: string;
        venue: string;
        address: string;
      };
    };
    gallery: {
      title: string;
      images: string[];
    };
    rsvp: {
      ticketTitle: string;
      deadline: string;
      confirmationMessage: string;
    };
  }