
export type User = {
    sub: number;
    identificacion: string;
    nombre: string;
    correo : string;
    img : string;
    rol : number | undefined;
}

export type JwtPayload = {
    sub : number;
    identificacion : string;
    nombre : string;
    correo : string;
    img : string;
    rol : number | undefined;
}