import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { StatementResult } from './run-sql';

/** Rows shown per result before "… N more rows". */
const MAX_ROWS = 200;

/** psql-style results: one table (or command tag) per statement, errors in red. */
@Component({
  selector: 'll-sql-output',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sql-output.component.html',
  styleUrl: './sql-output.component.css',
})
export class SqlOutputComponent {
  readonly results = input.required<StatementResult[]>();
  protected readonly max = MAX_ROWS;
}
