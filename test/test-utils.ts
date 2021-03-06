import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ServiceImplModule } from '../src/service-impl/service-impl.module';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { UserRegistrationApiRequest } from '../src/data/request/user-registration-api.request';
import * as faker from 'faker';
import { Gender } from '../src/domain/constants/gender.constant';
import { PortalUserRegistrationServiceImpl } from '../src/service-impl/portal-user-registration.service-impl';
import { RequestMetaData } from '../src/security/data/request-meta-data.dto';
import { PortalUserRegistrationService } from '../src/service/portal-user-registration.service';
import { PortalUser } from '../src/domain/entity/portal-user.entity';

export const mockSendEmail = () => jest.fn().mockImplementation((sendEmailOptions: ISendMailOptions) => {
  return Promise.resolve('Email has been sent successfully');
});

export function baseTestingModule() {
  return Test.createTestingModule({
    imports: [AppModule, ServiceImplModule],
    providers: [],
  }).overrideProvider(MailerService)
    .useValue({
      sendMail: mockSendEmail(),
    });
}

export function signUpUser(registrationService: PortalUserRegistrationService) {
  const requestPayload: UserRegistrationApiRequest = {
    displayName: faker.name.lastName(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    gender: Gender.FEMALE,
    isPasswordUpdateRequired: true,
    lastName: faker.name.lastName(),
    otherNames: faker.name.firstName(),
    password: faker.random.uuid(),
    phoneNumber: `${faker.phone.phoneNumber('+234#########')}`,
  };
  const requestMetaData: RequestMetaData = {
    get ipAddress(): string {
      return '127.0.0.1';
    },
    get localHost(): boolean {
      return true;
    },
    tokenExpired: false,
    get userAgent(): string {
      return 'Test: Environment';
    },

  } as RequestMetaData;
  return registrationService.register(requestPayload, requestMetaData).then(user => {
    return Promise.resolve({
      identifier: requestPayload.email,
      password: requestPayload.password,
    });
  });

}
