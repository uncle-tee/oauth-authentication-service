import { BaseEntity } from '../../tss-common/data-utils/base.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { PortalUserAuthentication } from './portal-user-authentication.entity';
import { PortalUser } from './portal-user.entity';
import { IllegalArgumentException } from '../../exceptions/illegal-argument.exception';

@Entity()
export class RefreshToken extends BaseEntity {

  @ManyToOne(() => PortalUserAuthentication)
  private _actualAuthentication: PortalUserAuthentication;

  @ManyToOne(() => PortalUser)
  portalUser: PortalUser;

  @Column({
    type: 'timestamp',
  })
  accessExpiresAt: Date;

  @Column({
    type: 'timestamp',
  })
  expiresAt: Date;


  timeDeactivated: Date;


  set actualAuthentication(userAuthentication: PortalUserAuthentication) {
    this._actualAuthentication = userAuthentication;
    if (this._actualAuthentication) {
      this.portalUser = userAuthentication.portalUser;
    } else {
      this.portalUser = null;
    }
  }


  @BeforeInsert()
  beforeInsert() {

    if (this._actualAuthentication) {
      this.portalUser = this._actualAuthentication.portalUser;
    } else {
      if (this.portalUser.id != this._actualAuthentication.portalUser.id) {
        throw new IllegalArgumentException();
      }
    }

  }


}