import { BaseEntity } from '../../tss-common/data-utils/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PortalUser } from './portal-user.entity';

@Entity()
export class PortalUserData extends BaseEntity {

  @ManyToOne(() => PortalUser)
  portalUser: PortalUser;
  @Column()
  name: string;
  @Column()
  value: string;
}