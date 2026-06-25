-- Prisma cannot express a partial unique index in schema.prisma, so this is
-- applied manually: at most one ACTIVE subscription per company.
CREATE UNIQUE INDEX uq_active_subscription ON subscriptions(company_id) WHERE status = 'active';