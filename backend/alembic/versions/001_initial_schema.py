"""Initial schema with auth models and indexes

Revision ID: 001_initial
Revises:
Create Date: 2025-11-09

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all tables with proper indexes and constraints"""

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('email_verified', sa.Boolean(), server_default='0', nullable=True),
        sa.Column('verification_token', sa.String(), nullable=True),
        sa.Column('verification_token_expires', sa.DateTime(), nullable=True),
        sa.Column('reset_token', sa.String(), nullable=True),
        sa.Column('reset_token_expires', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='1', nullable=True),
        sa.Column('is_superuser', sa.Boolean(), server_default='0', nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('github_id', sa.String(), nullable=True),
        sa.Column('github_username', sa.String(), nullable=True),
        sa.Column('theme', sa.String(), server_default='light', nullable=True),
        sa.Column('role', sa.String(), server_default='user', nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes on users table
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index('idx_user_email_active', 'users', ['email', 'is_active'])
    op.create_index('idx_user_github', 'users', ['github_id', 'github_username'])
    op.create_index('idx_user_verification', 'users', ['verification_token', 'email_verified'])

    # Create refresh_tokens table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('token', sa.String(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('revoked', sa.Boolean(), server_default='0', nullable=True),
        sa.Column('device_info', sa.String(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes on refresh_tokens table
    op.create_index(op.f('ix_refresh_tokens_user_id'), 'refresh_tokens', ['user_id'])
    op.create_index(op.f('ix_refresh_tokens_token'), 'refresh_tokens', ['token'], unique=True)
    op.create_index(op.f('ix_refresh_tokens_revoked'), 'refresh_tokens', ['revoked'])
    op.create_index('idx_token_valid', 'refresh_tokens', ['token', 'revoked', 'expires_at'])
    op.create_index('idx_user_tokens', 'refresh_tokens', ['user_id', 'revoked', 'expires_at'])

    # Create login_attempts table
    op.create_table(
        'login_attempts',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('ip_address', sa.String(), nullable=False),
        sa.Column('success', sa.Boolean(), server_default='0', nullable=True),
        sa.Column('attempted_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes on login_attempts table
    op.create_index(op.f('ix_login_attempts_email'), 'login_attempts', ['email'])
    op.create_index(op.f('ix_login_attempts_ip_address'), 'login_attempts', ['ip_address'])
    op.create_index(op.f('ix_login_attempts_success'), 'login_attempts', ['success'])
    op.create_index(op.f('ix_login_attempts_attempted_at'), 'login_attempts', ['attempted_at'])
    op.create_index('idx_email_time', 'login_attempts', ['email', 'attempted_at'])
    op.create_index('idx_ip_time', 'login_attempts', ['ip_address', 'attempted_at'])
    op.create_index('idx_email_ip_time', 'login_attempts', ['email', 'ip_address', 'attempted_at'])


def downgrade() -> None:
    """Drop all tables"""
    op.drop_table('login_attempts')
    op.drop_table('refresh_tokens')
    op.drop_table('users')
