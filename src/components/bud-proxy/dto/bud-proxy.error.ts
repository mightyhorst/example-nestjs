import {IBUDErrorResponse} from "@components/bud-proxy/service/bud";

export class BudErrorResponse implements IBUDErrorResponse {
    name: string;
    message: string;
    code: number;
    status: number;
}
