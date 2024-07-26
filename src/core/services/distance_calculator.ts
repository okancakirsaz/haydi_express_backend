export class DistanceCalculator{
    private baseLocation:Record<string,number>
    private targetLocation:Record<string,number>
    constructor(baseLocation:Record<string,number>,targetLocation:Record<string,number>){
       this.baseLocation = baseLocation;
       this.targetLocation = targetLocation;
    }

    public calculate():number {
        //Radius of earth as kilometer type
        const R = 6371;
    
        //Convert lat,long to radians
        const toRadians = (degree: number) => degree * (Math.PI / 180);
        const lat1Rad = toRadians(this.baseLocation['lat']);
        const lon1Rad = toRadians(this.baseLocation['long']);
        const lat2Rad = toRadians(this.targetLocation['lat']);
        const lon2Rad = toRadians(this.targetLocation['long']);
    
        //Distances
        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;
    
        //Haversine formula
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c;
    
        return distance;
    }
}