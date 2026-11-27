export type Language = 'en' | 'de';
export type Role = 'patient' | 'doctor';
export interface Day { date:string; day:number; weekday:string; today:boolean; appointments:number; available:boolean; reminder:boolean }
export interface CareSnapshot {
 version:number; lang:Language; screen:string; authMode:'signin'|'signup'; loginRole:Role;
 authError:string; authValues:{name?:string;email?:string;password?:string};
 days:Day[]; next:{doctor:string;date:string;window:string}|null;
}
export interface CareBridge {
 snapshot():CareSnapshot; action(action:string):void;
 subscribe(fn:()=>void):()=>void; beforeRender(fn:()=>void):()=>void;
}
declare global { interface Window { MAVYSBridge?:CareBridge } }
