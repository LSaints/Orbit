namespace Orbit.Infrastructure.Storage;

public interface IFileStorageService
{
    Task<string> UploadAsync(string bucketName, string objectName, Stream data, string contentType);
    Task RemoveAsync(string bucketName, string objectName);
    string GetObjectUrl(string objectName);
}