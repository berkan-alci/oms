/**
 * Support auth catalog operations
 */
import HttpClient from '../../../core/http';
import { CatalogEntity } from './tokens';
export declare function listCatalog(client: HttpClient): Promise<CatalogEntity[]>;
