import { v1 as neo4j } from 'neo4j-driver';
import { NewsletterMemberViewModel } from '../../view-models/newsletter/newsletter-member.view-model';

export interface IUsersService {
    createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean>;
    deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean>;
}
