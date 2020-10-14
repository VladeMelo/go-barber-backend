// quando vc quer sobrescrever tipos de uma biblioteca

declare namespace Express {
  export interface Request {
    // vai exportart o Request JUNTO com os anexos que eu colocar
    user: {
      id: string;
    };
  }
}
