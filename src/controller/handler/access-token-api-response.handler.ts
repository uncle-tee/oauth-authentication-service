import { AccessTokenApiResponse } from '../../data/response/access-token-api.response';
import { RefreshTokenService } from '../../service/refresh-token.service';
import { Inject } from '@nestjs/common';
import { PortalUserAuthentication } from '../../domain/entity/portal-user-authentication.entity';
import { Connection } from 'typeorm';
import { AuthKeyGenerator } from '../../security/contracts/auth-key-generator.contracts';
import { ACCESSKEYGENERATOR, REFRESHKEYGENERATOR } from '../../security/constants';
import { PortalUserIdentifierRepository } from '../../dao/portal-user-identifier.repository';
import { PortalUserIdentifier } from '../../domain/entity/portal-user-identifier.entity';
import { UserIdentifierType } from '../../domain/constants/user-identifier-type.constant';

export class AccessTokenApiResponseHandler {
  constructor(@Inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService,
              @Inject(REFRESHKEYGENERATOR) private readonly refreshKeyGenerator: AuthKeyGenerator,
              @Inject(ACCESSKEYGENERATOR) private readonly accessKeyGenerator: AuthKeyGenerator,
              private readonly connection: Connection) {
  }

  public getAccessToken(portalUserAuthentication: PortalUserAuthentication): Promise<AccessTokenApiResponse> {
    return this.connection.transaction(async entityManager => {

      let refreshToken = await this.refreshTokenService.createRefreshToken(entityManager, portalUserAuthentication);
      let accessTokenApiResponse = new AccessTokenApiResponse(refreshToken.portalUser);
      let refreshTokenJwt = await this.refreshKeyGenerator.generateJwt(refreshToken);
      let accessTokenDtoJwt = await this.accessKeyGenerator.generateJwt(refreshToken);
      let portalUserIdentifiers = await this.connection.getCustomRepository(PortalUserIdentifierRepository).findByPortalUser(refreshToken.portalUser);
      accessTokenApiResponse.emailAddresses = this.getEmailIdentifiers(portalUserIdentifiers);
      accessTokenApiResponse.phoneNumbers = this.getPhoneNumberIdentifier(portalUserIdentifiers);
      accessTokenApiResponse.refresh_token = refreshTokenJwt.token;
      accessTokenApiResponse.access_token = accessTokenDtoJwt.token;
      accessTokenApiResponse.expires_at = refreshToken.accessExpiresAt;
      accessTokenApiResponse.secondsTillExpiry = accessTokenDtoJwt.secondsTillExpiry;
      return Promise.resolve(accessTokenApiResponse);

    });

  }


  private getEmailIdentifiers(identifiers: PortalUserIdentifier[]) {
    return identifiers.filter(identifier => identifier.identifierType === UserIdentifierType.EMAIL)
      .map(identifier => {
        return identifier.identifier;
      });
  }

  private getPhoneNumberIdentifier(identifiers: PortalUserIdentifier[]) {
    return identifiers.filter(identifier => identifier.identifierType === UserIdentifierType.PHONE_NUMBER)
      .map(identifier => {
        return identifier.identifier;
      });
  }
}