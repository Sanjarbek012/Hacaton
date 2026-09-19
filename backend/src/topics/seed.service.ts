import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CURRICULUM } from './curriculum';
import { Subject, Topic } from './topic.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly log = new Logger(SeedService.name);

  constructor(@InjectRepository(Topic) private readonly repo: Repository<Topic>) {}

  /** Har ishga tushganda curriculum.ts bilan bazani moslaydi: yangi mavzular qo'shiladi,
   *  simKey va tartib yangilanadi. Saqlangan natijalar o'chmaydi. */
  async onApplicationBootstrap() {
    if (process.env.SEED_RESET === 'true') {
      await this.repo.query('TRUNCATE TABLE topics RESTART IDENTITY CASCADE');
      this.log.warn("Mavzular va natijalar tozalandi, qayta yuklanmoqda...");
    }

    const key = (s: string, g: number, t: string) => `${s}|${g}|${t}`;
    const existing = new Map((await this.repo.find()).map((t) => [key(t.subject, t.grade, t.title), t]));
    const toSave: Topic[] = [];

    for (const subject of Object.keys(CURRICULUM) as Subject[]) {
      for (const [grade, items] of Object.entries(CURRICULUM[subject])) {
        items.forEach((item, i) => {
          const [title, simKey]: [string, string | null] = typeof item === 'string' ? [item, null] : item;
          const found = existing.get(key(subject, Number(grade), title));
          if (!found) {
            toSave.push(this.repo.create({ subject, grade: Number(grade), title, simKey, sortOrder: i }));
          } else if (found.simKey !== simKey || found.sortOrder !== i) {
            found.simKey = simKey;
            found.sortOrder = i;
            toSave.push(found);
          }
        });
      }
    }
    if (toSave.length) {
      await this.repo.save(toSave);
      this.log.log(`${toSave.length} ta mavzu qo'shildi/yangilandi`);
    }
  }
}
