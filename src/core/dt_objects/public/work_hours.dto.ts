export class WorkHoursDto {
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;

    static toJson(data: WorkHoursDto): any {
        return {
          "startHour": data.startHour,
          "startMinute": data.startMinute,
          "endHour": data.endHour,
          "endMinute": data.endMinute,
        };
      }
    
      static fromJson(data: any): WorkHoursDto {
        const object: WorkHoursDto = new WorkHoursDto();
        object.startHour = data['startHour'];
        object.startMinute = data['startMinute'];
        object.endHour = data['endHour'];
        object.endMinute = data['endMinute'];
        return object;
      }

}
