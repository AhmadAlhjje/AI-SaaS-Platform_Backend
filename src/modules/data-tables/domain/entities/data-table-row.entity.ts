interface ReconstituteProps {
  readonly id: string;
  readonly dataTableId: string;
  readonly rowIndex: number;
  readonly rowData: Record<string, unknown>;
  readonly createdAt: Date;
}

/**
 * Only ever reconstituted from a persisted row (see PrismaDataTableRowRepository) —
 * rows are created in bulk via DataTableRepository.createWithRows, which
 * takes plain parsed row data rather than this entity, since dataTableId
 * doesn't exist yet until the table itself is created in the same transaction.
 */
export class DataTableRowEntity {
  private constructor(
    public readonly id: string | null,
    public readonly dataTableId: string,
    public readonly rowIndex: number,
    public readonly rowData: Record<string, unknown>,
    public readonly createdAt: Date,
  ) {}

  static reconstitute(props: ReconstituteProps): DataTableRowEntity {
    return new DataTableRowEntity(props.id, props.dataTableId, props.rowIndex, props.rowData, props.createdAt);
  }
}
