package org.telegram.ai.agent.data.local.db.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow
import org.telegram.ai.agent.ai.models.ModelProviderConfig

@Dao
interface ModelProviderDao {
    @Query("SELECT * FROM model_provider_configs ORDER BY createdAt ASC")
    fun getAllConfigurations(): Flow<List<ModelProviderConfig>>

    @Query("SELECT * FROM model_provider_configs WHERE id = :id LIMIT 1")
    suspend fun getConfigurationById(id: String): ModelProviderConfig?

    @Query("SELECT * FROM model_provider_configs WHERE isDefault = 1 LIMIT 1")
    suspend fun getDefaultConfiguration(): ModelProviderConfig?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertConfiguration(config: ModelProviderConfig)

    @Update
    suspend fun updateConfiguration(config: ModelProviderConfig)

    @Query("UPDATE model_provider_configs SET isDefault = 0")
    suspend fun clearDefaultFlags()

    @Query("UPDATE model_provider_configs SET isDefault = 1 WHERE id = :id")
    suspend fun setDefault(id: String)

    @Delete
    suspend fun deleteConfiguration(config: ModelProviderConfig)

    @Query("DELETE FROM model_provider_configs WHERE id = :id")
    suspend fun deleteById(id: String)
}
