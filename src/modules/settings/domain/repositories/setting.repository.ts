import { SettingEntity } from '../entities/setting.entity';

export interface SettingRepository {
  findByCompanyId(companyId: string): Promise<SettingEntity | null>;
  create(setting: SettingEntity): Promise<SettingEntity>;
  update(setting: SettingEntity): Promise<SettingEntity>;
}
