import { EntityRepository, Repository } from 'typeorm'
import { PointEvent } from '../domain/point.event.entity'

@EntityRepository(PointEvent)
export class PointEventRepository extends Repository<PointEvent> {}
