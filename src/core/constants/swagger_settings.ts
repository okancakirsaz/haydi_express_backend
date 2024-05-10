import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class SwaggerSettings{
    private app:INestApplication<any>;
    public document;

    private readonly config = new DocumentBuilder()
    .setTitle('Haydi Express API')
    .setDescription('Haydi Express Public API')
    .setVersion('Development')
    .addTag('API')
    .build();

    constructor(app:INestApplication<any>){
        this.app=app;
        this.document = SwaggerModule.createDocument(this.app, this.config);
    }

    
}