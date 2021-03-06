import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { ConfModule } from './conf/conf.module';
import { DaoModule } from './dao/dao.module';
import { DomainModule } from './domain/domain.module';
import { ServiceModule } from './service/service.module';
import { ServiceImplModule } from './service-impl/service-impl.module';
import { CoreModule } from './core/core.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { EventHandlersModule } from './event-handlers/event-handlers.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    ControllerModule,
    ConfModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ConfModule.environment + '.env'],
    }),
    DaoModule,
    DomainModule,
    ServiceModule,
    ServiceImplModule,
    CoreModule,
    ExceptionsModule,
    EventsModule,
    EventHandlersModule,
    SecurityModule],
  providers: [],
})
export class AppModule {
}
